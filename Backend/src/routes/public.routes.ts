import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { PhysicalProgramController } from '../controllers/PhysicalProgramController';

const router = Router();


router.get('/mentors', UserController.getPublicMentors);
router.get('/mentors/:mentorId/availability', UserController.getMentorAvailability);
router.get('/physical-programs', UserController.getPhysicalPrograms);
router.get('/next-physical-program', PhysicalProgramController.getUpcomingProgram);


export default router;