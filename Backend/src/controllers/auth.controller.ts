import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { completeRegistrationSchema } from '../schemas/auth.schema';
import { ZodError } from 'zod';

export const AuthController = {
  
  registerUser: async (req: Request, res: Response) => {
    try {
        await AuthService.register(req.body, req);

        res.status(201).json({ 
            message: 'Registration successful! Please check your email to verify your account.' 
        });

    } catch (error: any) {
        if (error.code === '23505') {
            res.status(409).json({ message: 'Error: Username or email already exists.' });
            return; 
        }
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const user = await AuthService.verifyEmail(token);

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired verification token.' });
            return; 
        }
        
        res.status(200).send('<h1>Email Verified Successfully!</h1><p>You can now close this window and log in.</p>');

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Server error during email verification.' });
    }
  },
  

  loginUser: async (req: Request, res: Response) => {
        try {
            const result = await AuthService.login(req.body);

            if (!result) {
                res.status(401).json({ message: 'Invalid username or password.' });
                return; 
            }

            res.status(200).json(result);

        } catch (error: any) {
            if (error.name === 'EmailNotVerified') {
                res.status(403).json({ message: error.message });
                return; 
            }
            
            console.error(error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    },
  
  forgotPassword: async (req: Request, res: Response) => {
        try {
            await AuthService.forgotPassword(req.body.email, req);


            res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Server error.' });
        }
    },


    resetPassword: async (req: Request, res: Response) => {
        const { newPassword } = req.body;
        const { token } = req.params;

        try {
            const result = await AuthService.resetPassword(token, newPassword);

            if (!result.success) {
                res.status(400).json({ message: result.message });
                return; 
            }

            res.status(200).json({ message: result.message });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Server error.' });
        }
    },
  
  changePassword: async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authorized.' });
            return;
        }

        try {
            const result = await AuthService.changePassword(userId, req.body);

            if (!result.success) {
                res.status(400).json({ message: result.message });
                return;
            }

            res.status(200).json({ message: result.message });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Server error while changing password.' });
        }
    },

  
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const userProfile = await AuthService.getProfile(userId);

            if (!userProfile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json(userProfile);
        } catch (error) {
            next(error);
        }
    },

  
    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const profileData = req.body;
            const profilePictureFile = req.file; 

            const updatedProfile = await AuthService.updateProfile(
                userId,
                profileData,
                profilePictureFile
            );
            
            res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedProfile,
            });
        } catch (error) {
            next(error);
        }
    },


    inviteMentor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, courseId } = req.body;
            const inviterId = (req as any).user.id;
            const mentor = await AuthService.inviteMentor(email, courseId, inviterId);
            res.status(201).json({ message: 'Mentor invitation sent successfully', mentor });
        } catch (error) {
            next(error);
        }
    },

    completeRegistration: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params; 
            const userData = req.body;   

            const result = await AuthService.completeRegistration(token, userData);

            if (!result.success) {
                return res.status(400).json({ message: result.message });
            }

            res.status(200).json({ 
                message: 'Registration completed successfully!', 
                user: result.user 
            });
        } catch (error) {
            next(error);
        }
    },


    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await AuthService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    },

    
};
    