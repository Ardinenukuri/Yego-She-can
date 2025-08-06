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
exports.CourseController = void 0;
const CourseService_1 = require("../services/CourseService");
exports.CourseController = {
    createCourse: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const creatorId = req.user.id;
            const course = yield CourseService_1.CourseService.createCourse(name, creatorId);
            res.status(201).json({ message: 'Course created successfully', course });
        }
        catch (error) {
            next(error);
        }
    }),
    getCourses: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield CourseService_1.CourseService.getAllCourses();
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    deleteCourse: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courseId = parseInt(req.params.id, 10);
            yield CourseService_1.CourseService.deleteCourse(courseId);
            res.status(200).json({ message: 'Course deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllCoursesForAdmin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield CourseService_1.CourseService.getAllCourses();
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    getAllCoursesForLearner: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const courses = yield CourseService_1.CourseService.getAllCoursesForLearner(learnerId);
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    enrollInCourse: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const { courseId } = req.body;
            const result = yield CourseService_1.CourseService.enrollInCourse(learnerId, courseId);
            res.status(201).json(Object.assign({ message: 'Successfully enrolled in course' }, result));
        }
        catch (error) {
            next(error);
        }
    }),
    getPublicCourses: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield CourseService_1.CourseService.getPublicCourses();
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    getAdminCourseList: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield CourseService_1.CourseService.getAdminCourseList();
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    getEnrolledCourses: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const courses = yield CourseService_1.CourseService.getEnrolledCoursesForLearner(learnerId);
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    getCourseLearningData: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const courseId = parseInt(req.params.id, 10);
            const data = yield CourseService_1.CourseService.getCourseLearningData(courseId, learnerId);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }),
    toggleChapterCompletion: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const { chapterId } = req.body;
            const result = yield CourseService_1.CourseService.toggleChapterCompletion(learnerId, chapterId);
            res.status(200).json(Object.assign({ message: `Chapter status updated.` }, result));
        }
        catch (error) {
            next(error);
        }
    }),
    getCoursesForMentor: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id; // From the 'protect' middleware
            const courses = yield CourseService_1.CourseService.getCoursesForMentor(mentorId);
            res.status(200).json(courses);
        }
        catch (error) {
            next(error);
        }
    }),
    getChaptersForCourse: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courseId = parseInt(req.params.id, 10);
            const mentorId = req.user.id;
            const chapters = yield CourseService_1.CourseService.getChaptersForCourse(courseId, mentorId);
            res.status(200).json(chapters);
        }
        catch (error) {
            next(error);
        }
    }),
    getCourseDetailsForAdmin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courseId = parseInt(req.params.id, 10);
            if (isNaN(courseId)) {
                return res.status(400).json({ message: 'Invalid Course ID provided.' });
            }
            const courseDetails = yield CourseService_1.CourseService.getCourseDetailsForAdmin(courseId);
            res.status(200).json(courseDetails);
        }
        catch (error) {
            next(error);
        }
    }),
};
