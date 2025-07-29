import { Request, Response, NextFunction } from 'express';
import { LearnerService } from '../services/LearnerService';
import { MentorService } from '../services/MentorService';

export const LearnerController = {
    bookSlot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            if (!user || !user.id) {
                return res.status(401).json({ message: 'Authentication error: User not found.' });
            }
            const learnerId = user.id;

            const { slotId, topic } = req.body;
            await LearnerService.bookMentorshipSlot(learnerId, slotId, topic);
            res.status(200).json({ message: 'Session booked successfully! Please check your email for confirmation.' });
        } catch (error) { 
            next(error); 
        }
    },

    getMentorAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = parseInt(req.params.mentorId, 10);
            const slots = await MentorService.getMentorAvailability(mentorId);
            res.status(200).json(slots);
        } catch (error) { next(error); }
    },

    getPhysicalPrograms: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const data = await LearnerService.getPhysicalPrograms(learnerId);
            res.status(200).json(data);
        } catch (error) { next(error); }
    },
    enrollInPhysicalProgram: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const { programId } = req.body;
            const enrollment = await LearnerService.enrollInPhysicalProgram(learnerId, programId);
            res.status(201).json({ message: 'Successfully enrolled in the program.', enrollment });
        } catch (error) { next(error); }
    },
};