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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateService_1 = require("../services/certificateService");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
router.post('/issue', auth_middleware_1.protect, (0, authorize_middleware_1.authorize)('program manager'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { learnerId, courseId } = req.body;
    if (!learnerId || !courseId) {
        return res.status(400).json({ message: 'Learner ID and Course ID are required.' });
    }
    try {
        const certificate = yield (0, certificateService_1.issueCertificate)(learnerId, courseId);
        res.status(201).json(certificate);
    }
    catch (error) {
        console.error('Failed to issue certificate:', error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'An unknown server error occurred.' });
    }
}));
router.get('/my-certificates', auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication error, user not found.' });
    }
    try {
        const certificates = yield (0, certificateService_1.getMyCertificates)(req.user.id);
        res.json(certificates);
    }
    catch (error) {
        console.error('Failed to fetch certificates:', error);
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: 'An unknown server error occurred.' });
    }
}));
router.post('/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { learnerName, courseName, issuedDate } = req.body;
    if (!learnerName || !courseName || !issuedDate) {
        return res.status(400).json({ message: 'Missing required certificate data.' });
    }
    try {
        yield (0, certificateService_1.generateCertificatePdfStream)(res, learnerName, courseName, issuedDate);
    }
    catch (error) {
        console.error("Failed to generate PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate certificate PDF.' });
        }
    }
}));
exports.default = router;
