import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const UserController = {
    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await AuthService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const { status, role } = req.body;
            const updatedUser = await AuthService.updateUser(userId, status, role);
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            next(error);
        }
    },

    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id, 10);
            await AuthService.deleteUser(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    },

    getEnrolledLearners: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentorId = (req as any).user.id;
            const courseId = parseInt(req.query.courseId as string, 10);

            if (!courseId || isNaN(courseId)) {
                return res.status(400).json({ message: 'A valid courseId query parameter is required.' });
            }

            const learners = await AuthService.getEnrolledLearnersForCourse(mentorId, courseId);
            res.status(200).json(learners);
        } catch (error) {
            next(error);
        }
    },

    getAllMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentors = await AuthService.getAllMentors();
            res.status(200).json(mentors);
        } catch (error) {
            next(error);
        }
    },

    getAllLearners: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const learners = await AuthService.getAllLearners();
            res.status(200).json(learners);
        } catch (error){
            next(error);
        }
    },

    getPublicMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mentors = await AuthService.getPublicMentors();
            res.status(200).json(mentors);
        } catch (error) {
            next(error);
        }
    },

    searchEligibleMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the search query from the URL, e.g., /api/users/eligible-mentors?q=ardine
            const searchQuery = (req.query.q as string) || '';
            const users = await AuthService.searchEligibleMentors(searchQuery);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    },
    
};