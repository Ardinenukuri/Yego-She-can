import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { documentUpload } from '../middlewares/documentUpload.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createResourceSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/', protect, authorize('mentor'), documentUpload.single('resourceFile'), validateRequest(createResourceSchema), ResourceController.uploadResource);

export default router;