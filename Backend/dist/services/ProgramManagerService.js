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
exports.ProgramManagerService = void 0;
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../config/db"));
const email_1 = __importDefault(require("../utils/email"));
const promises_1 = __importDefault(require("fs/promises"));
exports.ProgramManagerService = {
    getPendingApplications: () => __awaiter(void 0, void 0, void 0, function* () {
        return (yield db_1.default.query("SELECT * FROM mentor_applications WHERE status = 'pending' ORDER BY submitted_at ASC")).rows;
    }),
    processApplication: (applicationId, decision, programManagerName) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield db_1.default.connect();
        try {
            yield client.query('BEGIN');
            const updateResult = yield client.query("UPDATE mentor_applications SET status = $1 WHERE id = $2 AND status = 'pending' RETURNING name, email", [decision, applicationId]);
            if (updateResult.rowCount === 0) {
                throw new Error('Application not found or already processed.');
            }
            const { name, email } = updateResult.rows[0];
            // Send email notification to the applicant
            let subject = '';
            let emailBody = '';
            if (decision === 'approved') {
                subject = 'Your YegoSheCan Mentor Application has been Approved!';
                emailBody = `
                    <h1>Congratulations, ${name}!</h1>
                    <p>We are thrilled to inform you that your application to become a mentor at YegoSheCan has been approved.</p>
                    <p>Our team will be in touch with you shortly via this email address to send an official invitation to the platform, where you can complete your registration and set up your mentor profile.</p>
                    <p>Welcome to the community!</p>
                `;
            }
            else { // Declined
                subject = 'Update on your YegoSheCan Mentor Application';
                emailBody = `
                    <h1>Update on Your Mentor Application</h1>
                    <p>Hello ${name},</p>
                    <p>Thank you for your interest in becoming a mentor at YegoSheCan and for taking the time to submit an application.</p>
                    <p>After careful review, we regret to inform you that we are unable to proceed with your application at this time. We received a large number of highly qualified applicants, and the selection process was very competitive.</p>
                    <p>We appreciate your passion for empowering women entrepreneurs and wish you all the best in your future endeavors.</p>
                `;
            }
            yield (0, email_1.default)({
                to: email, subject, html: emailBody,
                text: ''
            });
            yield client.query('COMMIT');
            return { success: true, applicantName: name };
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }),
    createPhysicalProgram: (data, creatorId, imageFile) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, duration, schedule, nextSession, location, skills, requirements } = data;
        let imageUrl = undefined;
        if (imageFile) {
            const uploadDir = 'uploads/programs';
            yield promises_1.default.mkdir(uploadDir, { recursive: true });
            const filename = `program-${Date.now()}-${imageFile.originalname}`;
            const fullPath = path_1.default.join(uploadDir, filename);
            yield promises_1.default.writeFile(fullPath, imageFile.buffer);
            imageUrl = `/${uploadDir}/${filename}`;
        }
        const query = `
            INSERT INTO physical_programs (title, description, duration, schedule, next_session, location, skills, requirements, image_url, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const { rows } = yield db_1.default.query(query, [
            title, description, duration, schedule, nextSession, location, skills, requirements, imageUrl, creatorId
        ]);
        return rows[0];
    }),
};
