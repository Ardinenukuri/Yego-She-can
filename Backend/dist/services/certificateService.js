"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePdfStream = exports.getMyCertificates = exports.issueCertificate = void 0;
const db_1 = __importDefault(require("../config/db"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const EmailService_1 = require("./EmailService");
// --- Service Functions ---
const issueCertificate = (learnerId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existingCert = yield db_1.default.query('SELECT id FROM certificates WHERE learner_id = $1 AND course_id = $2', [learnerId, courseId]);
    if (((_a = existingCert.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
        throw new Error('Certificate already issued for this learner and course.');
    }
    const issuedDate = new Date().toISOString().split('T')[0];
    const insertQuery = `
        INSERT INTO certificates (learner_id, course_id, issued_date)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const newCertificateResult = yield db_1.default.query(insertQuery, [learnerId, courseId, issuedDate]);
    const newCertificate = newCertificateResult.rows[0];
    try {
        const notificationDataQuery = `
            SELECT 
                u.email,
                u.first_name,
                u.last_name,
                c.name as "courseName"
            FROM users u, courses c
            WHERE u.id = $1 AND c.id = $2;
        `;
        const notificationDataResult = yield db_1.default.query(notificationDataQuery, [learnerId, courseId]);
        if (((_b = notificationDataResult === null || notificationDataResult === void 0 ? void 0 : notificationDataResult.rowCount) !== null && _b !== void 0 ? _b : 0) > 0) {
            const data = notificationDataResult.rows[0];
            const learnerFullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
            yield EmailService_1.EmailService.sendCertificateNotification(data.email, learnerFullName, data.courseName);
        }
        else {
            console.error(`[Certificate Service] Could not find user or course data for email notification. LearnerId: ${learnerId}, CourseId: ${courseId}`);
        }
    }
    catch (emailError) {
        console.error(`[Certificate Service] An error occurred while trying to send the certificate email notification:`, emailError);
    }
    return newCertificate;
});
exports.issueCertificate = issueCertificate;
const getMyCertificates = (learnerId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT 
            c.id, 
            co.name as "courseName",
            c.issued_date as "issuedDate", 
            c.certificate_url as "certificateUrl"
        FROM certificates c
        JOIN courses co ON c.course_id = co.id
        WHERE c.learner_id = $1
        ORDER BY c.issued_date DESC;
    `;
    const result = yield db_1.default.query(query, [learnerId]);
    return result.rows;
});
exports.getMyCertificates = getMyCertificates;
const generateCertificatePdfStream = (res, learnerName, courseName, issuedDate) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const page = yield browser.newPage();
    const frontendUrl = process.env.FRONTED_URL || 'http://host.docker.internal:3000';
    const certificatePageUrl = `${frontendUrl}/user-dashboard/components/${encodeURIComponent(learnerName)}?courseName=${encodeURIComponent(courseName)}&issuedDate=${issuedDate}`;
    console.log(`[Certificate Service] Puppeteer is attempting to visit: ${certificatePageUrl}`);
    try {
        yield page.goto(certificatePageUrl, { waitUntil: 'networkidle0', timeout: 30000 });
        const pdfBuffer = yield page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: true,
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate-${learnerName.replace(/\s/g, '_')}.pdf"`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error(`[Certificate Service] Puppeteer failed to load the page. Error:`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate certificate PDF. The certificate page could not be loaded.' });
        }
    }
    finally {
        yield browser.close();
    }
});
exports.generateCertificatePdfStream = generateCertificatePdfStream;
