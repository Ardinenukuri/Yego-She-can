import { LearnerController } from '../controllers/learner.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createBookingSchema } from '../schemas/auth.schema';
import { Router } from 'express';

const router = Router();

router.get('/mentors/:mentorId/availability', LearnerController.getMentorAvailability)
router.post(
    '/book-session', 
    protect, authorize('learner'), validateRequest(createBookingSchema),  LearnerController.bookSlot
);

export default router;