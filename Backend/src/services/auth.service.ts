import { Request } from 'express';
import fs from 'fs/promises';
import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import sendEmail from '../utils/email';
import { UserRegistrationData } from '../types/user.types';
import { RegisterBody } from '../schemas/auth.schema';
import { CourseService } from './CourseService';
import path from 'path';


interface MentorApplicationData {
    name: string;
    email: string;
    phone: string;
    expertise: string;
    education: string;
    experience: string;
    message: string;
}

export const AuthService = {
    register: async (userData: RegisterBody, req: Request) => {
        const { username, firstName, lastName, email, password, gender, age } = userData;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedVerificationToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        const { rows } = await pool.query(
            `INSERT INTO users (username, first_name, last_name, email, password_hash, verification_token, gender, age) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id, email, username`,
            [username, firstName, lastName, email, passwordHash, hashedVerificationToken, gender, age]
        );
        const user = rows[0];

        const verifyURL = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;

        const message = `
            <h1>Welcome to YegoSheCan!</h1>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verifyURL}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px;">Verify Your Email</a>
            <p>If you cannot click the link, please copy and paste this URL into your browser:</p>
            <p>${verifyURL}</p>
            <p>This link will be valid for a limited time.</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Email Verification - Yego SheCan',
            text: `Please verify your email by visiting this URL: ${verifyURL}`,
            html: message,
        });

        return user;
    },
    
    verifyEmail: async (token: string) => {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    
        const { rows } = await pool.query(
            'SELECT id FROM users WHERE verification_token = $1',
            [hashedToken]
        );

        if (rows.length === 0) {
            return null; 
        }
        const user = rows[0];

        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1',
            [user.id]
        );
        
        return user;
    },

    login: async (loginData: any) => {
        const { username, password } = loginData;

        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length === 0) {
            return null; 
        }
        const user = rows[0];

        
  if (user.status === 'disabled') {
    throw new Error('Your account has been disabled. Please contact support.');
  }
  if (user.status === 'pending') {
    throw new Error('Your account is pending. Please check your email to complete registration.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;


        if (!user.is_verified) {
            const err = new Error('Please verify your email before logging in.');
            err.name = 'EmailNotVerified';
            throw err;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordMatch) {
            return null; 
        }

        const payload = {
            id: user.id, 
            role: user.role
        };

        
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET!, 
            { expiresIn: '1d' } 
        );

    
        return { 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            } 
        };
    },

    forgotPassword: async (email: string, req: Request) => {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return true;
        }
        const user = rows[0];

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); 
        await pool.query(
            'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
            [hashedResetToken, resetTokenExpires, user.id]
        );

        const resetURL = `${process.env.FRONTED_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;

        const message = `
            <h1>You requested a password reset</h1>
            <p>A request was made to reset the password for your account. Please click the link below to set a new password:</p>
            <a href="${resetURL}" style="background-color:rgb(54, 98, 244); color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px;">Reset Your Password</a>
            <p>This link is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request - Inventory System',
            text: `To reset your password, visit this URL: ${resetURL}`,
            html: message,
        });
        
        return true;
    },


    resetPassword: async (token: string, newPassword: string) => {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const { rows } = await pool.query(
            'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
            [hashedToken]
        );

        if (rows.length === 0) {
            return { success: false, message: 'Token is invalid or has expired.' };
        }
        const user = rows[0];

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        
    
        await pool.query(
            'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
            [passwordHash, user.id]
        );

        return { success: true, message: 'Password has been reset successfully.' };
    },

     changePassword: async (userId: number, passwordData: any) => {
        const { previousPassword, newPassword } = passwordData;

        const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        
        if (rows.length === 0) {
            return { success: false, message: 'User not found.' };
        }
        const user = rows[0];
        
        const isMatch = await bcrypt.compare(previousPassword, user.password_hash);
        if (!isMatch) {
            return { success: false, message: 'Incorrect previous password.' };
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);

        return { success: true, message: 'Password changed successfully.' };
    },

     getProfile: async (userId: number) => {
        const { rows } = await pool.query(
            'SELECT id, username, first_name, last_name, email, location, bio, profile_picture_url, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (rows.length === 0) {
            return null;
        }
        
        return rows[0];
    },

    updateProfile: async (userId: number, profileData: any, profilePictureFile?: Express.Multer.File) => {
        const { username, firstName, lastName, location, bio } = profileData;

        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (username) {
            fieldsToUpdate.push(`username = $${paramIndex++}`);
            values.push(username);
        }
        if (firstName) {
            fieldsToUpdate.push(`first_name = $${paramIndex++}`);
            values.push(firstName);
        }
        if (lastName) {
            fieldsToUpdate.push(`last_name = $${paramIndex++}`);
            values.push(lastName);
        }
        if (location) {
            fieldsToUpdate.push(`location = $${paramIndex++}`);
            values.push(location);
        }
        if (bio) {
            fieldsToUpdate.push(`bio = $${paramIndex++}`);
            values.push(bio);
        }
        if (profilePictureFile) {
            const imageUrl = `/uploads/profiles/${profilePictureFile.filename}`;
            fieldsToUpdate.push(`profile_picture_url = $${paramIndex++}`);
            values.push(imageUrl);
        }

        
        if (fieldsToUpdate.length === 0) {
            return await AuthService.getProfile(userId);
        }

        
        values.push(userId);

        const updateQuery = `
            UPDATE users 
            SET ${fieldsToUpdate.join(', ')}, updated_at = NOW()
            WHERE id = $${paramIndex}
            RETURNING id, username, first_name, last_name, email, location, bio, profile_picture_url, role
        `;

        const { rows } = await pool.query(updateQuery, values);

        if (rows.length === 0) {
            throw new Error('User not found or update failed.');
        }

        return rows[0];
    },

    
    
    inviteMentor: async (email: string, courseId: number, inviterId: number) => {
        const course = await CourseService.getCourseById(courseId);
        if (!course) {
            throw new Error('Course not found.');
        }

        const existingUserResult = await pool.query('SELECT id, status, role FROM users WHERE email = $1', [email]);
        const existingUser = existingUserResult.rows[0];

        if (existingUser && existingUser.status === 'active') {
            if (existingUser.role !== 'mentor') {
                throw new Error(`An active user with the role '${existingUser.role}' already exists with this email.`);
            }

            const mentorId = existingUser.id;

            const assignmentCheck = await pool.query(
                'SELECT 1 FROM course_mentors WHERE course_id = $1 AND mentor_id = $2',
                [courseId, mentorId]
            );
             if ((assignmentCheck.rowCount ?? 0) > 0) {
                throw new Error('This mentor is already assigned to this course.');
            }

            await pool.query(
                'INSERT INTO course_mentors (course_id, mentor_id) VALUES ($1, $2)',
                [courseId, mentorId]
            );
            
            const dashboardUrl = `${process.env.FRONTED_URL || 'http://localhost:3000'}/dashboard/mentor/courses`;
            const message = `
                <h1>You Have a New Course Assignment!</h1>
                <p>Hello,</p>
                <p>You have been assigned to mentor a new course on the YegoSheCan platform: <strong>${course.name}</strong>.</p>
                <p>You can view your assigned courses by visiting your mentor dashboard.</p>
                <a href="${dashboardUrl}" style="display:inline-block;background-color:#4c1d95;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Go to Dashboard</a>
            `;
            await sendEmail({
                to: email,
                subject: `New Course Assignment: ${course.name}`,
                html: message,
                text: ''
            });

            return { id: mentorId, email, message: "Existing mentor successfully assigned to new course." };
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const invitationToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(invitationToken).digest('hex');

            const userQuery = `
                INSERT INTO users (email, verification_token, role, status)
                VALUES ($1, $2, 'mentor', 'pending')
                ON CONFLICT (email) DO UPDATE SET 
                    verification_token = EXCLUDED.verification_token,
                    role = 'mentor', -- Ensure role is set to mentor
                    status = 'pending' -- Reset to pending if they were, e.g., disabled
                RETURNING id
            `;
            const userResult = await client.query(userQuery, [email, hashedToken]);
            const mentorId = userResult.rows[0].id;
            
            const assignmentQuery = `
                INSERT INTO course_mentors (course_id, mentor_id)
                VALUES ($1, $2)
                ON CONFLICT (course_id, mentor_id) DO NOTHING
            `;
            await client.query(assignmentQuery, [courseId, mentorId]);
            
            await client.query('COMMIT');
            
            const completeRegistrationURL = `${process.env.FRONTED_URL || 'http://localhost:3000'}/auth/complete-registration/${invitationToken}`;
            const message = `
                <h1>You've been invited to be a Mentor at YegoSheCan!</h1>
                <p>You have been invited to mentor the course: <strong>${course.name}</strong>.</p>
                <p>Please click the link below to complete your registration and set up your account:</p>
                <a href="${completeRegistrationURL}" style="display:inline-block;background-color:#008CBA;color:white;padding:14px 25px;text-decoration:none;border-radius:8px;">Complete Your Registration</a>
            `;
            await sendEmail({
                to: email,
                subject: `Invitation to Mentor at YegoSheCan for ${course.name}`,
                html: message,
                text: ''
            });

            return { id: mentorId, email, role: 'mentor', status: 'pending' };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error; 
        } finally {
            client.release();
        }
    },

    completeRegistration: async (token: string, userData: any) => {
        const { firstName, lastName, username, password } = userData;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const { rows } = await pool.query(
            `SELECT id, role FROM users 
             WHERE verification_token = $1 AND status = 'pending'`,
            [hashedToken]
        );

        if (rows.length === 0) {
            return { success: false, message: 'Invitation token is invalid or has already been used.' };
        }
        
        const user = rows[0];

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const { rows: updatedRows } = await pool.query(
            `UPDATE users SET 
                first_name = $1,
                last_name = $2,
                username = $3,
                password_hash = $4,
                is_verified = TRUE,
                verification_token = NULL,
                status = 'active'
             WHERE id = $5
             RETURNING id, username, email, role, status`,
            [firstName, lastName, username, passwordHash, user.id]
        );

        return { success: true, user: updatedRows[0] };
    },

    getAllUsers: async () => {
        const { rows } = await pool.query(
            `SELECT id, username, email, first_name, last_name, role, status, created_at 
             FROM users ORDER BY created_at DESC`
        );
        return rows;
    },

    updateUser: async (userId: number, status?: 'active' | 'disabled', role?: 'user' | 'mentor' | 'program manager') => {
        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (status) {
            fieldsToUpdate.push(`status = $${paramIndex++}`);
            values.push(status);
        }
        if (role) {
            fieldsToUpdate.push(`role = $${paramIndex++}`);
            values.push(role);
        }

        if (fieldsToUpdate.length === 0) {
            throw new Error("No update information provided.");
        }

        values.push(userId); 

        const updateQuery = `
            UPDATE users SET ${fieldsToUpdate.join(', ')}, updated_at = NOW()
            WHERE id = $${paramIndex}
            RETURNING id, username, email, role, status
        `;

        const { rows } = await pool.query(updateQuery, values);
        if (rows.length === 0) {
            throw new Error('User not found.');
        }
        return rows[0];
    },

    
    deleteUser: async (userId: number): Promise<{ success: boolean }> => {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0) {
            throw new Error('User not found.');
        }
        return { success: true };
    },

     getEnrolledLearnersForCourse: async (mentorId: number, courseId: number) => {

        const assignmentCheck = await pool.query(
            'SELECT 1 FROM course_mentors WHERE mentor_id = $1 AND course_id = $2',
            [mentorId, courseId]
        );
        if ((assignmentCheck.rowCount ?? 0) === 0) {
            throw new Error('Forbidden: You are not a mentor for this course.');
        }

        const query = `
            SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                e.enrolled_at,
                -- Subquery to calculate progress for each user 'u'
                (
                    SELECT ROUND(
                        (
                            -- Count unique completed chapters (manual + quiz)
                            COUNT(DISTINCT completed.chapter_id) * 100.0
                        ) / 
                        -- Divide by total chapters, preventing division by zero
                        NULLIF(
                            (
                                SELECT COUNT(*) 
                                FROM chapters ch 
                                WHERE ch.resource_id = (SELECT id FROM resources WHERE course_id = e.course_id ORDER BY created_at DESC LIMIT 1)
                            ), 0
                        )
                    )
                    FROM 
                        (
                            -- Get manually completed chapters
                            SELECT ucp.chapter_id 
                            FROM user_chapter_progress ucp 
                            JOIN chapters ch ON ucp.chapter_id = ch.id 
                            WHERE ucp.learner_id = u.id AND ch.resource_id = (SELECT id FROM resources WHERE course_id = e.course_id ORDER BY created_at DESC LIMIT 1)
                            
                            UNION -- Combines and removes duplicates
                            
                            -- Get quiz-passed chapters
                            SELECT q.chapter_id 
                            FROM quiz_attempts qa 
                            JOIN quizzes q ON qa.quiz_id = q.id 
                            WHERE qa.learner_id = u.id AND q.resource_id = (SELECT id FROM resources WHERE course_id = e.course_id ORDER BY created_at DESC LIMIT 1) 
                              AND qa.passed = TRUE AND q.chapter_id IS NOT NULL
                        ) as completed
                )::int AS progress
            FROM
                users u
            JOIN
                enrollments e ON u.id = e.learner_id
            WHERE
                e.course_id = $1 AND u.role = 'learner'
            ORDER BY
                u.first_name, u.last_name;
        `;
        
        const { rows } = await pool.query(query, [courseId]);
        return rows;
    },

    applyToBeMentor: async (applicationData: MentorApplicationData, cvFile?: Express.Multer.File) => {
        const { name, email, phone, expertise, education, experience, message } = applicationData;

        let cvPath: string | undefined = undefined;
        if (cvFile) {
            // Save the CV to a public directory
            const uploadDir = 'uploads/cvs';
            await fs.mkdir(uploadDir, { recursive: true });
            const filename = `cv-${Date.now()}-${cvFile.originalname}`;
            const fullPath = path.join(uploadDir, filename);
            await fs.writeFile(fullPath, cvFile.buffer);
            cvPath = `/${uploadDir}/${filename}`; // Web-accessible path
        }
        
        // Use ON CONFLICT to update an existing application if the email is the same
        const insertQuery = `
            INSERT INTO mentor_applications (name, email, phone, expertise, education, experience, message, cv_path, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
            ON CONFLICT (email) DO UPDATE SET
                name = EXCLUDED.name, phone = EXCLUDED.phone, expertise = EXCLUDED.expertise,
                education = EXCLUDED.education, experience = EXCLUDED.experience, message = EXCLUDED.message,
                cv_path = EXCLUDED.cv_path, status = 'pending', submitted_at = NOW();
        `;
        await pool.query(insertQuery, [name, email, phone, expertise, education, experience, message, cvPath]);


        const { rows: programManagers } = await pool.query(
            "SELECT email FROM users WHERE role = 'program manager' AND status = 'active'"
        );

        if (programManagers.length === 0) {
            console.error("CRITICAL: Mentor application received, but no active program managers found to notify.");
            return { success: true }; 
        }

        const recipientEmails = programManagers.map(pm => pm.email);
        const subject = `New Mentor Application: ${name}`;
        
        const emailBody = `
            <h1>New Mentor Application Received</h1>
            <p>A new candidate has applied to become a mentor on the YegoSheCan platform. Their CV is attached to this email.</p>
            <hr>
            <h2>Applicant Details:</h2>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background-color:#f9f9f9;"><td style="padding:8px;border:1px solid #ddd;"><strong>Name:</strong></td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Email:</strong></td><td style="padding:8px;border:1px solid #ddd;">${email}</td></tr>
                <tr style="background-color:#f9f9f9;"><td style="padding:8px;border:1px solid #ddd;"><strong>Phone:</strong></td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
                <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Field of Expertise:</strong></td><td style="padding:8px;border:1px solid #ddd;">${expertise}</td></tr>
                <tr style="background-color:#f9f9f9;"><td style="padding:8px;border:1px solid #ddd;"><strong>Education:</strong></td><td style="padding:8px;border:1px solid #ddd;">${education}</td></tr>
            </table>
            
            <h2>Work Experience:</h2>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${experience}</p>

            <h2>Motivation Message:</h2>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
            <hr>
            <p><strong>Next Steps:</strong> To invite this person as a mentor, please log in to your Program Manager dashboard and use the "Invite Mentor" feature with their email address.</p>
        `;
        
        console.log("[Service] Received file object:", cvFile);

        const attachments = [];
        if (cvFile) {
            attachments.push({
                filename: cvFile.originalname,
                content: cvFile.buffer,
                contentType: cvFile.mimetype,
            });
            console.log("[Service] Attachment object created:", attachments[0]);
        } else {
            console.warn("[Service] No CV file was provided to the service.");
        
        }

        await sendEmail({
            to: recipientEmails.join(','),
            subject: subject,
            text: `New mentor application from ${name} (${email}). Their CV is attached.`,
            html: emailBody,
            attachments: attachments, 
        });

        return { success: true };
    },
    
    handleContactForm: async (contactData: { name: string; email: string; phone?: string; category: string; message: string }) => {
        const { name, email, phone, category, message } = contactData;

        
        const { rows: programManagers } = await pool.query(
            "SELECT email FROM users WHERE role = 'program manager' AND status = 'active'"
        );

        if (programManagers.length === 0) {
            console.error("CRITICAL: Contact form submission received, but no active program managers found to notify.");
            return { success: true }; 
        }

        const recipientEmails = programManagers.map(pm => pm.email);
        const subject = `New Contact Form Submission: [${category}] from ${name}`;
        const emailBody = `
            <h1>New Contact Form Submission</h1>
            <p>A message has been submitted through the website's contact form.</p>
            <hr>
            <h2>Submission Details:</h2>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
                <li><strong>Category:</strong> ${category}</li>
            </ul>
            <h2>Message:</h2>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
            <hr>
            <p>You can reply directly to the user at their provided email address.</p>
        `;

        await sendEmail({
            to: recipientEmails.join(','),
            subject: subject,
            text: `New contact message from ${name} (${email}). Category: ${category}. Message: ${message}`,
            html: emailBody,
        });

        return { success: true };
    },

    getAllMentors: async () => {

        const query = `
            SELECT
                u.id,
                u.first_name || ' ' || u.last_name as name,
                u.email,
                u.status,
                u.profile_picture_url as image,
                -- Aggregate all assigned course names into a single comma-separated string
                STRING_AGG(c.name, ', ') as expertise,
                -- Also get a count of assigned courses
                COUNT(c.id)::int as "assignedCourses"
            FROM 
                users u
            LEFT JOIN 
                course_mentors cm ON u.id = cm.mentor_id
            LEFT JOIN 
                courses c ON cm.course_id = c.id
            WHERE 
                u.role = 'mentor'
            GROUP BY 
                u.id, u.first_name, u.last_name, u.email, u.status, u.profile_picture_url
            ORDER BY 
                u.created_at DESC;
        `;
        
        const { rows } = await pool.query(query);


        return rows.map(mentor => ({
            ...mentor,
            status: mentor.status === 'active' ? 'Active' : 'Pending'
        }));
    },

    getAllLearners: async () => {
        const query = `
            SELECT
                id,
                first_name,
                last_name,
                email,
                status,
                profile_picture_url as image,
                created_at
            FROM users
            WHERE role = 'learner'
            ORDER BY created_at DESC;
        `;
        
        const { rows } = await pool.query(query);

        return rows.map(learner => ({
            ...learner,
            status: learner.status === 'active' ? 'Active' : learner.status === 'disabled' ? 'Inactive' : 'Pending'
        }));
    },

    getPublicMentors: async () => {
        const query = `
            SELECT
                u.id,
                u.first_name || ' ' || u.last_name as name,
                u.bio,
                u.profile_picture_url as image,
                -- Aggregate all assigned course names into a single comma-separated string
                COALESCE(STRING_AGG(c.name, ', '), 'General Mentorship') as expertise
            FROM 
                users u
            LEFT JOIN 
                course_mentors cm ON u.id = cm.mentor_id
            LEFT JOIN 
                courses c ON cm.course_id = c.id
            WHERE 
                u.role = 'mentor' AND u.status = 'active'
            GROUP BY 
                u.id, u.first_name, u.last_name, u.bio, u.profile_picture_url
            ORDER BY 
                name ASC;
        `;
        
        const { rows } = await pool.query(query);
        return rows;
    },

    searchEligibleMentors: async (searchQuery: string = '') => {
        const query = `
            SELECT id, first_name, last_name, email 
            FROM users 
            WHERE 
                first_name ILIKE $1 OR
                last_name ILIKE $1 OR
                email ILIKE $1
            ORDER BY 
                first_name, last_name -- Add a predictable order to the results
            LIMIT 10; -- Limit results for performance
        `;
        
        const searchValue = `%${searchQuery}%`;
        
        const { rows } = await pool.query(query, [searchValue]);
        return rows;
    },

    

};




