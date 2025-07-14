import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/ResourceService';

export const ResourceController = {
    uploadResource: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId, description, timeline } = req.body;
            const mentorId = (req as any).user.id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: 'A resource file is required.' });
            }

            const result = await ResourceService.addCourseResource(
                mentorId,
                courseId,
                description,
                timeline,
                file
            );

            res.status(201).json({ message: 'Resource and chapters uploaded successfully', ...result });
        } catch (error) {
            next(error);
        }
    }
};