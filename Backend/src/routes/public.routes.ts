import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();


router.get('/mentors', UserController.getPublicMentors);
router.get('/mentors/:mentorId/availability', UserController.getMentorAvailability);
router.get('/physical-programs', UserController.getPhysicalPrograms);

export default router;