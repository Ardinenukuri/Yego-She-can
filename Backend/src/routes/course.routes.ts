import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCourseSchema, enrollInCourseSchema, toggleCompletionSchema } from '../schemas/auth.schema';

const router = Router();


router.post('/', protect, authorize('program manager'), validateRequest(createCourseSchema), CourseController.createCourse);
router.get('/', protect, authorize('program manager'), CourseController.getCourses);
router.delete('/:id', protect, authorize('program manager'), CourseController.deleteCourse);
router.get('/available', protect, authorize('learner'), CourseController.getAllCoursesForLearner);
router.post('/enroll', protect, authorize('learner'), validateRequest(enrollInCourseSchema), CourseController.enrollInCourse);
router.get('/public', CourseController.getPublicCourses);
router.get('/admin-list', protect, authorize('program manager'), CourseController.getAdminCourseList);
router.get('/my-courses', protect, authorize('learner'), CourseController.getEnrolledCourses);
router.get('/learn/:id', protect, authorize('learner'), CourseController.getCourseLearningData);
router.post('/chapters/toggle-completion', protect, authorize('learner'), validateRequest(toggleCompletionSchema), CourseController.toggleChapterCompletion);
router.get('/:id', protect, authorize('program manager'), CourseController.getCourseDetailsForAdmin);
export default router;