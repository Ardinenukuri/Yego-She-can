import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { updateUserStatusSchema } from '../schemas/auth.schema';

const router = Router();


router.get('/', protect, authorize('program manager'), UserController.getAllUsers);

router.put('/:id', protect, authorize('program manager'), validateRequest(updateUserStatusSchema), UserController.updateUser);

router.delete('/:id', protect, authorize('program manager'), UserController.deleteUser);
router.get('/my-learners', protect, authorize('mentor'), UserController.getEnrolledLearners);
router.get('/mentors',protect, authorize('program manager'), UserController.getAllMentors);
router.get('/learners', UserController.getAllLearners);
router.get('/mentor', UserController.getPublicMentors);
export default router;