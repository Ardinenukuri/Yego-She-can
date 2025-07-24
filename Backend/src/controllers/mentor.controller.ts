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

    getAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const slots = await MentorService.getAvailability(mentorId);
            res.status(200).json(slots);
        } catch (error) { next(error); }
    },
    addAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const { date, times } = req.body;
            const newSlots = await MentorService.addAvailability(mentorId, date, times);
            res.status(201).json({ message: `${newSlots.length} slot(s) saved successfully.`, slots: newSlots });
        } catch (error) { next(error); }
    },
    updateSlotStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const slotId = parseInt(req.params.id, 10);
            const { status } = req.body;
            await MentorService.updateSlotStatus(mentorId, slotId, status);
            res.status(200).json({ message: 'Slot status updated.' });
        } catch (error) { next(error); }
    },
    deleteSlot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const slotId = parseInt(req.params.id, 10);
            await MentorService.deleteSlot(mentorId, slotId);
            res.status(200).json({ message: 'Slot deleted successfully.' });
        } catch (error) { next(error); }
    },
};