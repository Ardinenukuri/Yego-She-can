import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();


router.get('/', protect, authorize('program manager'), DashboardController.getDashboardData);

export default router;