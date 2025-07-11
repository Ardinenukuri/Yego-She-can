import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        gender: z.string()
                   .refine(val => val === 'Female', {
                       message: 'Registration is currently open to female users only.',
                   }),
        age: z.number().int().positive().lte(30, {
            message: 'You must be 30 years old or younger to register.'
        }),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
});

export type RegisterBody = z.infer<typeof registerSchema>['body'];

export const loginSchema = z.object({
    body: z.object({
        username: z.string(),
        password: z.string(),
    }),
});


export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Please provide a valid email address'),
    }),
});

export const resetPasswordSchema = z.object({
    params: z.object({
        token: z.string().min(1, 'Token is required'),
    }),
    body: z.object({
        newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
        confirmNewPassword: z.string().min(6),
    }).refine(data => data.newPassword === data.confirmNewPassword, {
        message: "Passwords don't match",
        path: ["confirmNewPassword"],
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        previousPassword: z.string().min(1, 'Previous password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
        confirmNewPassword: z.string().min(6),
    }).refine(data => data.newPassword === data.confirmNewPassword, {
        message: "New passwords don't match",
        path: ["confirmNewPassword"],
    }),
});


export const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50).optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        location: z.string().min(2).max(100).optional(),
        bio: z.string().max(500).optional(),
    }),

})

export const completeRegistrationSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
});

export const updateUserSchema = z.object({
  body: z.object({
    role: z.enum(['admin', 'user']).optional(),
    status: z.enum(['active', 'pending', 'disabled']).optional(),
  }),
});