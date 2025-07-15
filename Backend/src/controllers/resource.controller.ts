import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/ResourceService';

export const ResourceController = {
    uploadResource: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId, description, timeline, level } = req.body;
            const mentorId = (req as any).user.id;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };


            const result = await ResourceService.addCourseResource(
                mentorId,
                courseId,
                { description, timeline, level },
                files
            );

            res.status(201).json({ message: 'Resource, image, and chapters uploaded successfully', ...result });
        } catch (error) {
            next(error);
        }
    }
};