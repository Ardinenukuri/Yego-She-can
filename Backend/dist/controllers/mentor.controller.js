"use strict";
// src/controllers/mentor.controller.ts
// ... (imports)
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
exports.MentorController = void 0;
const MentorService_1 = require("../services/MentorService");
const CourseService_1 = require("../services/CourseService");
const ReportService_1 = require("../services/ReportService");
exports.MentorController = {
    // ... (keep getQuizOverview)
    getDashboardData: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const data = yield MentorService_1.MentorService.getDashboardData(mentorId);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }),
    messageLearner: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const { learnerId, courseId, message } = req.body;
            yield MentorService_1.MentorService.messageLearner(mentorId, learnerId, courseId, message);
            res.status(200).json({ message: 'Message sent successfully.' });
        }
        catch (error) {
            next(error);
        }
    }),
    getCourseDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courseId = parseInt(req.params.courseId, 10);
            const mentorId = req.user.id;
            const course = yield CourseService_1.CourseService.getCourseDetailsForMentor(courseId, mentorId);
            res.status(200).json(course);
        }
        catch (error) {
            next(error);
        }
    }),
    getAvailability: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const slots = yield MentorService_1.MentorService.getAvailability(mentorId);
            res.status(200).json(slots);
        }
        catch (error) {
            next(error);
        }
    }),
    addAvailability: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const { date, times } = req.body;
            const newSlots = yield MentorService_1.MentorService.addAvailability(mentorId, date, times);
            res.status(201).json({ message: `${newSlots.length} slot(s) saved successfully.`, slots: newSlots });
        }
        catch (error) {
            next(error);
        }
    }),
    updateSlotStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const slotId = parseInt(req.params.id, 10);
            const { status } = req.body;
            yield MentorService_1.MentorService.updateSlotStatus(mentorId, slotId, status);
            res.status(200).json({ message: 'Slot status updated.' });
        }
        catch (error) {
            next(error);
        }
    }),
    deleteSlot: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const slotId = parseInt(req.params.id, 10);
            yield MentorService_1.MentorService.deleteSlot(mentorId, slotId);
            res.status(200).json({ message: 'Slot deleted successfully.' });
        }
        catch (error) {
            next(error);
        }
    }),
    exportDashboardPDF: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const mentorName = `${req.user.firstName} ${req.user.lastName}`;
            const pdfBuffer = yield ReportService_1.ReportService.generateMentorReportPDF(mentorId, mentorName);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="mentor-report-${Date.now()}.pdf"`);
            res.send(pdfBuffer);
        }
        catch (error) {
            next(error);
        }
    }),
};
