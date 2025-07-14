import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/CourseService';

export const CourseController = {
    createCourse: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const creatorId = (req as any).user.id; 
            const course = await CourseService.createCourse(name, creatorId);
            res.status(201).json({ message: 'Course created successfully', course });
        } catch (error) {
            next(error);
        }
    },

    getCourses: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await CourseService.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },

    deleteCourse: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = parseInt(req.params.id, 10);
            await CourseService.deleteCourse(courseId);
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            next(error);
        }
    },

    getAllCoursesForAdmin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await CourseService.getAllCourses(); 
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },


    getAllCoursesForLearner: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const courses = await CourseService.getAllCoursesForLearner(learnerId);
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },

    enrollInCourse: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const { courseId } = req.body;
            const result = await CourseService.enrollInCourse(learnerId, courseId);
            res.status(201).json({ message: 'Successfully enrolled in course', ...result });
        } catch (error) {
            next(error);
        }
    },
};