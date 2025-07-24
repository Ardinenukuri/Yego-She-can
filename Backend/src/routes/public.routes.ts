import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();


router.get('/mentors', UserController.getPublicMentors);
router.get('/mentors/:mentorId/availability', UserController.getMentorAvailability);

export default router;