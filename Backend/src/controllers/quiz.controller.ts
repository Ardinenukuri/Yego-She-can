// src/controllers/quiz.controller.ts
import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/QuizService';

export const QuizController = {
    generateChapterQuiz: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const { courseId, chapterId } = req.body;
            const quiz = await QuizService.createChapterQuiz(mentorId, courseId, chapterId);
            res.status(201).json({ message: 'Chapter quiz generated successfully!', quiz });
        } catch (error) {
            next(error);
        }
    },

    generateFinalQuiz: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const { courseId } = req.body;
            const quiz = await QuizService.createFinalQuiz(mentorId, courseId);
            res.status(201).json({ message: 'Final quiz generated successfully!', quiz });
        } catch (error) {
            next(error);
        }
    },

    getQuiz: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const quizId = parseInt(req.params.id, 10);
            const data = await QuizService.getQuizForLearner(learnerId, quizId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    submitQuiz: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const quizId = parseInt(req.params.id, 10);
            const { answers } = req.body;
            const result = await QuizService.submitQuiz(learnerId, quizId, answers);
            res.status(200).json({ message: 'Quiz submitted successfully!', result });
        } catch (error) {
            next(error);
        }
    },
};