// src/routes/programManager.routes.ts
import { Router } from 'express';
import { ProgramManagerController } from '../controllers/programManager.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();
router.use(protect, authorize('program manager'));

// GET /api/pm/applications - Get all pending applications
router.get('/applications', ProgramManagerController.getApplications);

// PUT /api/pm/applications/:id/process - Approve or decline an application
router.put('/applications/:id/process', ProgramManagerController.processApplication);

export default router;