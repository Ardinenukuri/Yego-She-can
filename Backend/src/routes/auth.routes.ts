import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema, changePasswordSchema, updateProfileSchema, completeRegistrationSchema, mentorApplicationSchema, contactFormSchema } from '../schemas/auth.schema';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { inviteMentorSchema } from '../schemas/auth.schema';
import { cvUpload } from '../middlewares/cvUpload.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.registerUser);
router.post('/login', validateRequest(loginSchema), AuthController.loginUser);
router.get('/verify/:token', AuthController.verifyEmail);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
router.put('/reset-password/:token', validateRequest(resetPasswordSchema), AuthController.resetPassword);
router.put('/complete-registration/:token', validateRequest(completeRegistrationSchema), AuthController.completeRegistration);
router.post('/apply-mentor', cvUpload.single('cv'), validateRequest(mentorApplicationSchema),AuthController.applyToBeMentor);
router.post('/contact', validateRequest(contactFormSchema), AuthController.handleContactForm);


router.use(protect);

router.put('/change-password', validateRequest(changePasswordSchema), AuthController.changePassword);
router.get('/profile', AuthController.getProfile);
router.put('/profile', protect, upload.single('profilePicture'),  validateRequest(updateProfileSchema), AuthController.updateProfile);
router.post('/invite-mentor', protect, authorize('program manager'), validateRequest(inviteMentorSchema), AuthController.inviteMentor);



export default router;