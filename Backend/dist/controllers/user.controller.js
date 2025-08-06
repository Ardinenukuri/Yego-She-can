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
exports.UserController = void 0;
const auth_service_1 = require("../services/auth.service");
const MentorService_1 = require("../services/MentorService");
const LearnerService_1 = require("../services/LearnerService");
exports.UserController = {
    getAllUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield auth_service_1.AuthService.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    }),
    updateUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const { status, role } = req.body;
            const updatedUser = yield auth_service_1.AuthService.updateUser(userId, status, role);
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        }
        catch (error) {
            next(error);
        }
    }),
    deleteUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            yield auth_service_1.AuthService.deleteUser(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }),
    getEnrolledLearners: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const courseId = parseInt(req.query.courseId, 10);
            if (!courseId || isNaN(courseId)) {
                return res.status(400).json({ message: 'A valid courseId query parameter is required.' });
            }
            const learners = yield auth_service_1.AuthService.getEnrolledLearnersForCourse(mentorId, courseId);
            res.status(200).json(learners);
        }
        catch (error) {
            next(error);
        }
    }),
    getAllMentors: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentors = yield auth_service_1.AuthService.getAllMentors();
            res.status(200).json(mentors);
        }
        catch (error) {
            next(error);
        }
    }),
    getAllLearners: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learners = yield auth_service_1.AuthService.getAllLearners();
            res.status(200).json(learners);
        }
        catch (error) {
            next(error);
        }
    }),
    getPublicMentors: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentors = yield auth_service_1.AuthService.getPublicMentors();
            res.status(200).json(mentors);
        }
        catch (error) {
            next(error);
        }
    }),
    searchEligibleMentors: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.q || '';
            const users = yield auth_service_1.AuthService.searchEligibleMentors(searchQuery);
            res.status(200).json(users);
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
            const programs = yield LearnerService_1.LearnerService.getPublicPhysicalPrograms();
            res.status(200).json(programs);
        }
        catch (error) {
            next(error);
        }
    }),
};
