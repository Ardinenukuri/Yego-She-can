"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
exports.AuthController = {
    registerUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield auth_service_1.AuthService.register(req.body, req);
            res.status(201).json({
                message: 'Registration successful! Please check your email to verify your account.'
            });
        }
        catch (error) {
            if (error.code === '23505') {
                res.status(409).json({ message: 'Error: Username or email already exists.' });
                return;
            }
            console.error(error);
            res.status(500).json({ message: 'Server error during registration.' });
        }
    }),
    verifyEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            const user = yield auth_service_1.AuthService.verifyEmail(token);
            if (!user) {
                res.status(400).json({ message: 'Invalid or expired verification token.' });
                return;
            }
            res.status(200).send('<h1>Email Verified Successfully!</h1><p>You can now close this window and log in.</p>');
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error during email verification.' });
        }
    }),
    loginUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield auth_service_1.AuthService.login(req.body);
            if (!result) {
                res.status(401).json({ message: 'Invalid username or password.' });
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            if (error.name === 'EmailNotVerified') {
                res.status(403).json({ message: error.message });
                return;
            }
            console.error(error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield auth_service_1.AuthService.forgotPassword(req.body.email, req);
            res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error.' });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { newPassword } = req.body;
        const { token } = req.params;
        try {
            const result = yield auth_service_1.AuthService.resetPassword(token, newPassword);
            if (!result.success) {
                res.status(400).json({ message: result.message });
                return;
            }
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error.' });
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authorized.' });
            return;
        }
        try {
            const result = yield auth_service_1.AuthService.changePassword(userId, req.body);
            if (!result.success) {
                res.status(400).json({ message: result.message });
                return;
            }
            res.status(200).json({ message: result.message });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error while changing password.' });
        }
    }),
    getProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const userProfile = yield auth_service_1.AuthService.getProfile(userId);
            if (!userProfile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json(userProfile);
        }
        catch (error) {
            next(error);
        }
    }),
    updateProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const profileData = req.body;
            const profilePictureFile = req.file;
            const updatedProfile = yield auth_service_1.AuthService.updateProfile(userId, profileData, profilePictureFile);
            res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedProfile,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    inviteMentor: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, courseId } = req.body;
            const inviterId = req.user.id;
            const mentor = yield auth_service_1.AuthService.inviteMentor(email, courseId, inviterId);
            res.status(201).json({ message: 'Mentor invitation sent successfully', mentor });
        }
        catch (error) {
            next(error);
        }
    }),
    completeRegistration: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            const userData = req.body;
            const result = yield auth_service_1.AuthService.completeRegistration(token, userData);
            if (!result.success) {
                return res.status(400).json({ message: result.message });
            }
            res.status(200).json({
                message: 'Registration completed successfully!',
                user: result.user
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield auth_service_1.AuthService.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    }),
    applyToBeMentor: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const applicationData = req.body;
            const cvFile = req.file;
            console.log("[Controller] Received file object:", cvFile);
            if (!cvFile) {
                console.error("[Controller] WARNING: CV file is undefined. Check the frontend field name and multer config.");
            }
            yield auth_service_1.AuthService.applyToBeMentor(applicationData, cvFile);
            res.status(200).json({ message: 'Your application has been submitted successfully.' });
        }
        catch (error) {
            next(error);
        }
    }),
    handleContactForm: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const contactData = req.body;
            yield auth_service_1.AuthService.handleContactForm(contactData);
            res.status(200).json({ message: 'Your message has been sent successfully. We will get back to you shortly.' });
        }
        catch (error) {
            next(error);
        }
    }),
};
