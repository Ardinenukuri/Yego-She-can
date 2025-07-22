import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/CourseService';
import { AuthService } from '../services/auth.service';

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

    getPublicCourses: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await CourseService.getPublicCourses();
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },

    getAdminCourseList: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await CourseService.getAdminCourseList();
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },

    getEnrolledCourses: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const courses = await CourseService.getEnrolledCoursesForLearner(learnerId);
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },

    getCourseLearningData: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const courseId = parseInt(req.params.id, 10);
            const data = await CourseService.getCourseLearningData(courseId, learnerId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    toggleChapterCompletion: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learnerId = (req as any).user.id;
            const { chapterId } = req.body;
            const result = await CourseService.toggleChapterCompletion(learnerId, chapterId);
            res.status(200).json({ message: `Chapter status updated.`, ...result });
        } catch (error) {
            next(error);
        }
    },

    getCoursesForMentor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id; // From the 'protect' middleware
            const courses = await CourseService.getCoursesForMentor(mentorId);
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    },

    getChaptersForCourse: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = parseInt(req.params.id, 10);
            const mentorId = (req as any).user.id;
            const chapters = await CourseService.getChaptersForCourse(courseId, mentorId);
            res.status(200).json(chapters);
        } catch (error) {
            next(error);
        }
    },

    
};