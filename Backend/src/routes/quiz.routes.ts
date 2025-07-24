import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { generateChapterQuizSchema, generateFinalQuizSchema, submitQuizSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/chapter', protect, authorize('mentor'), validateRequest(generateChapterQuizSchema), QuizController.generateChapterQuiz);
router.post('/final', protect, authorize('mentor'), validateRequest(generateFinalQuizSchema), QuizController.generateFinalQuiz);
router.get('/:id', protect, authorize('learner'), QuizController.getQuiz);
router.post('/:id/submit', protect, authorize('learner'), validateRequest(submitQuizSchema), QuizController.submitQuiz);

export default router;