import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { documentUpload } from '../middlewares/documentUpload.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createResourceSchema } from '../schemas/auth.schema';
import { resourceUpload } from '../middlewares/resourceUpload.middleware';

const router = Router();

router.post('/', protect, authorize('mentor'), resourceUpload, validateRequest(createResourceSchema), ResourceController.uploadResource);

export default router;