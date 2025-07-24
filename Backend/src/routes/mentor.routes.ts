// src/routes/mentor.routes.ts
import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { QuizController } from '../controllers/quiz.controller';
import { MentorController } from '../controllers/mentor.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { messageLearnerSchema } from '../schemas/auth.schema';

const router = Router();

router.use(protect, authorize('mentor'));

router.get('/courses', CourseController.getCoursesForMentor);
router.get('/quizzes/overview', QuizController.getQuizOverview);
router.get('/courses/:id/chapters', CourseController.getChaptersForCourse);
router.get('/dashboard', MentorController.getDashboardData);
router.post('/message-learner', validateRequest(messageLearnerSchema), MentorController.messageLearner);
router.get('/courses/:courseId/details', MentorController.getCourseDetails);
router.get('/availability', MentorController.getAvailability);
router.post('/availability', MentorController.addAvailability);
router.put('/availability/:id', MentorController.updateSlotStatus);
router.delete('/availability/:id', MentorController.deleteSlot);
export default router;