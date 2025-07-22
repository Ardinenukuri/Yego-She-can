// src/routes/mentor.routes.ts
import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { QuizController } from '../controllers/quiz.controller';

const router = Router();

// All routes in this file are for logged-in mentors
router.use(protect, authorize('mentor'));

// GET /api/mentor/courses - Get all courses assigned to the current mentor
router.get('/courses', CourseController.getCoursesForMentor);
router.get('/quizzes/overview', QuizController.getQuizOverview);
router.get('/courses/:id/chapters', CourseController.getChaptersForCourse);

export default router;