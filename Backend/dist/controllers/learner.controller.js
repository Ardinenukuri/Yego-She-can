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
exports.LearnerController = void 0;
const LearnerService_1 = require("../services/LearnerService");
const MentorService_1 = require("../services/MentorService");
exports.LearnerController = {
    bookSlot: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user || !user.id) {
                return res.status(401).json({ message: 'Authentication error: User not found.' });
            }
            const learnerId = user.id;
            const { slotId, topic } = req.body;
            yield LearnerService_1.LearnerService.bookMentorshipSlot(learnerId, slotId, topic);
            res.status(200).json({ message: 'Session booked successfully! Please check your email for confirmation.' });
        }
        catch (error) {
            next(error);
        }
    }),
    getMentorAvailability: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            const slots = yield MentorService_1.MentorService.getMentorAvailability(mentorId);
            res.status(200).json(slots);
        }
        catch (error) {
            next(error);
        }
    }),
    getPhysicalPrograms: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const data = yield LearnerService_1.LearnerService.getPhysicalPrograms(learnerId);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }),
    enrollInPhysicalProgram: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const { programId } = req.body;
            const enrollment = yield LearnerService_1.LearnerService.enrollInPhysicalProgram(learnerId, programId);
            res.status(201).json({ message: 'Successfully enrolled in the program.', enrollment });
        }
        catch (error) {
            next(error);
        }
    }),
};
