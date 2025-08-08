import express from 'express';
import { PhysicalProgramController } from '../controllers/PhysicalProgramController';

const router = express.Router();


router.get('/public/next-physical-program', PhysicalProgramController.getUpcomingProgram);

export default router;