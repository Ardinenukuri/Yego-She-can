// src/controllers/mentor.controller.ts
// ... (imports)

import { Request, Response, NextFunction } from "express";
import { MentorService } from "../services/MentorService";
import { CourseService } from "../services/CourseService";

export const MentorController = {
    // ... (keep getQuizOverview)
    
    getDashboardData: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const data = await MentorService.getDashboardData(mentorId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    messageLearner: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const { learnerId, courseId, message } = req.body;
            await MentorService.messageLearner(mentorId, learnerId, courseId, message);
            res.status(200).json({ message: 'Message sent successfully.' });
        } catch (error) {
            next(error);
        }
    },

    getCourseDetails: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const courseId = parseInt(req.params.courseId, 10);
            

            const mentorId = (req as any).user.id;
            
            const course = await CourseService.getCourseDetailsForMentor(courseId, mentorId);
            res.status(200).json(course);
        } catch (error) {
            next(error);
        }
    },
};