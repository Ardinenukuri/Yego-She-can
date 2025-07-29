import { Router } from 'express';
import { ProgramManagerController } from '../controllers/programManager.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import multer from 'multer';

const programImageUpload = multer({ storage: multer.memoryStorage() });
const router = Router();
router.use(protect, authorize('program manager'));


router.get('/applications', ProgramManagerController.getApplications);


router.put('/applications/:id/process', ProgramManagerController.processApplication);
router.post('/physical-programs', programImageUpload.single('image'), ProgramManagerController.createPhysicalProgram);

export default router;