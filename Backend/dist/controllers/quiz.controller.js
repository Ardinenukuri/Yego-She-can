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
exports.QuizController = void 0;
const QuizService_1 = require("../services/QuizService");
exports.QuizController = {
    generateChapterQuiz: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const { courseId, chapterId } = req.body;
            const quiz = yield QuizService_1.QuizService.createChapterQuiz(mentorId, courseId, chapterId);
            res.status(201).json({ message: 'Chapter quiz generated successfully!', quiz });
        }
        catch (error) {
            next(error);
        }
    }),
    generateFinalQuiz: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const { courseId } = req.body;
            const quiz = yield QuizService_1.QuizService.createFinalQuiz(mentorId, courseId);
            res.status(201).json({ message: 'Final quiz generated successfully!', quiz });
        }
        catch (error) {
            next(error);
        }
    }),
    getQuiz: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const quizId = parseInt(req.params.id, 10);
            const data = yield QuizService_1.QuizService.getQuizForLearner(learnerId, quizId);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }),
    submitQuiz: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const learnerId = req.user.id;
            const quizId = parseInt(req.params.id, 10);
            const { answers } = req.body;
            const result = yield QuizService_1.QuizService.submitQuiz(learnerId, quizId, answers);
            res.status(200).json({ message: 'Quiz submitted successfully!', result });
        }
        catch (error) {
            next(error);
        }
    }),
    getQuizOverview: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mentorId = req.user.id;
            const quizzes = yield QuizService_1.QuizService.getQuizOverviewForMentor(mentorId);
            res.status(200).json(quizzes);
        }
        catch (error) {
            next(error);
        }
    }),
};
