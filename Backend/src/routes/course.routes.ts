import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCourseSchema, enrollInCourseSchema } from '../schemas/auth.schema';

const router = Router();


router.post('/', protect, authorize('program manager'), validateRequest(createCourseSchema), CourseController.createCourse);
router.get('/', protect, authorize('program manager'), CourseController.getCourses);
router.delete('/:id', protect, authorize('program manager'), CourseController.deleteCourse);
router.get('/available', protect, authorize('learner'), CourseController.getAllCoursesForLearner);
router.post('/enroll', protect, authorize('learner'), validateRequest(enrollInCourseSchema), CourseController.enrollInCourse);
router.get('/public', CourseController.getPublicCourses);
router.get('/admin-list', protect, authorize('program manager'), CourseController.getAdminCourseList);
export default router;