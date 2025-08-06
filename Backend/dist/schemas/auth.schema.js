"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = exports.messageLearnerSchema = exports.toggleCompletionSchema = exports.contactFormSchema = exports.mentorApplicationSchema = exports.submitQuizSchema = exports.generateFinalQuizSchema = exports.generateChapterQuizSchema = exports.enrollInCourseSchema = exports.createResourceSchema = exports.updateUserStatusSchema = exports.completeRegistrationSchema = exports.inviteMentorSchema = exports.createCourseSchema = exports.updateUserSchema = exports.updateProfileSchema = exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3).max(50),
        firstName: zod_1.z.string().min(1),
        lastName: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        gender: zod_1.z.string()
            .refine(val => val === 'Female', {
            message: 'Registration is currently open to female users only.',
        }),
        age: zod_1.z.number().int().positive().lte(30, {
            message: 'You must be 30 years old or younger to register.'
        }),
        password: zod_1.z.string().min(6),
        confirmPassword: zod_1.z.string().min(6),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Please provide a valid email address'),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Token is required'),
    }),
    body: zod_1.z.object({
        newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        confirmNewPassword: zod_1.z.string().min(6),
    }).refine(data => data.newPassword === data.confirmNewPassword, {
        message: "Passwords don't match",
        path: ["confirmNewPassword"],
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        previousPassword: zod_1.z.string().min(1, 'Previous password is required'),
        newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters long'),
        confirmNewPassword: zod_1.z.string().min(6),
    }).refine(data => data.newPassword === data.confirmNewPassword, {
        message: "New passwords don't match",
        path: ["confirmNewPassword"],
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3).max(50).optional(),
        firstName: zod_1.z.string().min(1).optional(),
        lastName: zod_1.z.string().min(1).optional(),
        location: zod_1.z.string().min(2).max(100).optional(),
        bio: zod_1.z.string().max(500).optional(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(['admin', 'user']).optional(),
        status: zod_1.z.enum(['active', 'pending', 'disabled']).optional(),
    }),
});
exports.createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, 'Course name must be at least 3 characters long').max(100),
    }),
});
exports.inviteMentorSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        courseId: zod_1.z.number().int().positive('A valid course ID is required'),
    }),
});
exports.completeRegistrationSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, 'A verification token is required.'),
    }),
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
        username: zod_1.z.string().min(3, 'Username must be at least 3 characters long'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        confirmPassword: zod_1.z.string().min(6),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    }),
});
exports.updateUserStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.string()
            .refine(val => val === 'active' || val === 'pending' || val === 'disabled', {
            message: "Status must be either 'active' or 'disabled'."
        }),
        role: zod_1.z.enum(['learner', 'mentor', 'program manager']).optional(),
    }),
});
exports.createResourceSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.string().transform(val => parseInt(val, 10)),
        description: zod_1.z.string().min(10, 'Description is too short'),
        timeline: zod_1.z.string().min(3, 'Timeline is required'),
        level: zod_1.z.string().refine((val) => ['beginner', 'intermediate', 'advanced'].includes(val), {
            message: "Level must be 'beginner', 'intermediate', or 'advanced'."
        }),
    }),
});
exports.enrollInCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.number().int().positive('A valid course ID is required.'),
    }),
});
exports.generateChapterQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.number().int().positive(),
        chapterId: zod_1.z.number().int().positive(),
    }),
});
exports.generateFinalQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.number().int().positive(),
    }),
});
exports.submitQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        // The answers will be an object where keys are question text and values are the selected option
        answers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    }),
});
exports.mentorApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, 'Full name is required.'),
        email: zod_1.z.string().email('A valid email address is required.'),
        phone: zod_1.z.string().min(10, 'A valid phone number is required.'),
        expertise: zod_1.z.string().min(5, 'Please specify your field of expertise.'),
        education: zod_1.z.string().min(10, 'Please provide your educational background.'),
        experience: zod_1.z.string().min(20, 'Please describe your work experience.'),
        message: zod_1.z.string().min(20, 'Please tell us more about why you want to be a mentor.'),
    }),
});
exports.contactFormSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, 'Full name is required.'),
        email: zod_1.z.string().email('A valid email address is required.'),
        phone: zod_1.z.string().optional(), // Phone is optional
        category: zod_1.z.enum(['support', 'partnership', 'feedback', 'other']),
        message: zod_1.z.string().min(10, 'Please provide a more detailed message.'),
    }),
});
exports.toggleCompletionSchema = zod_1.z.object({
    body: zod_1.z.object({
        chapterId: zod_1.z.number().int().positive(),
    }),
});
exports.messageLearnerSchema = zod_1.z.object({
    body: zod_1.z.object({
        learnerId: zod_1.z.number().int().positive(),
        courseId: zod_1.z.number().int().positive(),
        message: zod_1.z.string().min(10, 'Message must be at least 10 characters long.'),
    }),
});
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        slotId: zod_1.z.number().int().positive(),
        topic: zod_1.z.string().min(10, 'Please provide a brief topic for the meeting.'),
    }),
});
