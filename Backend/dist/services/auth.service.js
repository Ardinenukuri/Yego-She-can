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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = __importDefault(require("../utils/email"));
const CourseService_1 = require("./CourseService");
const path_1 = __importDefault(require("path"));
exports.AuthService = {
    register: (userData, req) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, firstName, lastName, email, password, gender, age } = userData;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(password, salt);
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedVerificationToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        const { rows } = yield db_1.default.query(`INSERT INTO users (username, first_name, last_name, email, password_hash, verification_token, gender, age) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id, email, username`, [username, firstName, lastName, email, passwordHash, hashedVerificationToken, gender, age]);
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
        yield (0, email_1.default)({
            to: user.email,
            subject: 'Email Verification - Inventory System',
            text: `Please verify your email by visiting this URL: ${verifyURL}`,
            html: message,
        });
        return user;
    }),
    verifyEmail: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const { rows } = yield db_1.default.query('SELECT id FROM users WHERE verification_token = $1', [hashedToken]);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        yield db_1.default.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1', [user.id]);
        return user;
    }),
    login: (loginData) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = loginData;
        const { rows } = yield db_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
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
        const isMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch)
            return null;
        if (!user.is_verified) {
            const err = new Error('Please verify your email before logging in.');
            err.name = 'EmailNotVerified';
            throw err;
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordMatch) {
            return null;
        }
        const payload = {
            id: user.id,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }),
    forgotPassword: (email, req) => __awaiter(void 0, void 0, void 0, function* () {
        const { rows } = yield db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return true;
        }
        const user = rows[0];
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedResetToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
        yield db_1.default.query('UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3', [hashedResetToken, resetTokenExpires, user.id]);
        const resetURL = `${process.env.FRONTED_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;
        const message = `
            <h1>You requested a password reset</h1>
            <p>A request was made to reset the password for your account. Please click the link below to set a new password:</p>
            <a href="${resetURL}" style="background-color:rgb(54, 98, 244); color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px;">Reset Your Password</a>
            <p>This link is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `;
        yield (0, email_1.default)({
            to: user.email,
            subject: 'Password Reset Request - Inventory System',
            text: `To reset your password, visit this URL: ${resetURL}`,
            html: message,
        });
        return true;
    }),
    resetPassword: (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const { rows } = yield db_1.default.query('SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()', [hashedToken]);
        if (rows.length === 0) {
            return { success: false, message: 'Token is invalid or has expired.' };
        }
        const user = rows[0];
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(newPassword, salt);
        yield db_1.default.query('UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2', [passwordHash, user.id]);
        return { success: true, message: 'Password has been reset successfully.' };
    }),
    changePassword: (userId, passwordData) => __awaiter(void 0, void 0, void 0, function* () {
        const { previousPassword, newPassword } = passwordData;
        const { rows } = yield db_1.default.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            return { success: false, message: 'User not found.' };
        }
        const user = rows[0];
        const isMatch = yield bcryptjs_1.default.compare(previousPassword, user.password_hash);
        if (!isMatch) {
            return { success: false, message: 'Incorrect previous password.' };
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const newPasswordHash = yield bcryptjs_1.default.hash(newPassword, salt);
        yield db_1.default.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);
        return { success: true, message: 'Password changed successfully.' };
    }),
    getProfile: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const { rows } = yield db_1.default.query('SELECT id, username, first_name, last_name, email, location, bio, profile_picture_url, role, created_at FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }),
    updateProfile: (userId, profileData, profilePictureFile) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, firstName, lastName, location, bio } = profileData;
        const fieldsToUpdate = [];
        const values = [];
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
            return yield exports.AuthService.getProfile(userId);
        }
        values.push(userId);
        const updateQuery = `
            UPDATE users 
            SET ${fieldsToUpdate.join(', ')}, updated_at = NOW()
            WHERE id = $${paramIndex}
            RETURNING id, username, first_name, last_name, email, location, bio, profile_picture_url, role
        `;
        const { rows } = yield db_1.default.query(updateQuery, values);
        if (rows.length === 0) {
            throw new Error('User not found or update failed.');
        }
        return rows[0];
    }),
    inviteMentor: (email, courseId, inviterId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const course = yield CourseService_1.CourseService.getCourseById(courseId);
        if (!course) {
            throw new Error('Course not found.');
        }
        const existingUserResult = yield db_1.default.query('SELECT id, status, role FROM users WHERE email = $1', [email]);
        const existingUser = existingUserResult.rows[0];
        if (existingUser && existingUser.status === 'active') {
            if (existingUser.role !== 'mentor') {
                throw new Error(`An active user with the role '${existingUser.role}' already exists with this email.`);
            }
            const mentorId = existingUser.id;
            const assignmentCheck = yield db_1.default.query('SELECT 1 FROM course_mentors WHERE course_id = $1 AND mentor_id = $2', [courseId, mentorId]);
            if (((_a = assignmentCheck.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
                throw new Error('This mentor is already assigned to this course.');
            }
            yield db_1.default.query('INSERT INTO course_mentors (course_id, mentor_id) VALUES ($1, $2)', [courseId, mentorId]);
            const dashboardUrl = `${process.env.FRONTED_URL || 'http://localhost:3000'}/dashboard/mentor/courses`;
            const message = `
                <h1>You Have a New Course Assignment!</h1>
                <p>Hello,</p>
                <p>You have been assigned to mentor a new course on the YegoSheCan platform: <strong>${course.name}</strong>.</p>
                <p>You can view your assigned courses by visiting your mentor dashboard.</p>
                <a href="${dashboardUrl}" style="display:inline-block;background-color:#4c1d95;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Go to Dashboard</a>
            `;
            yield (0, email_1.default)({
                to: email,
                subject: `New Course Assignment: ${course.name}`,
                html: message,
                text: ''
            });
            return { id: mentorId, email, message: "Existing mentor successfully assigned to new course." };
        }
        const client = yield db_1.default.connect();
        try {
            yield client.query('BEGIN');
            const invitationToken = crypto_1.default.randomBytes(32).toString('hex');
            const hashedToken = crypto_1.default.createHash('sha256').update(invitationToken).digest('hex');
            const userQuery = `
                INSERT INTO users (email, verification_token, role, status)
                VALUES ($1, $2, 'mentor', 'pending')
                ON CONFLICT (email) DO UPDATE SET 
                    verification_token = EXCLUDED.verification_token,
                    role = 'mentor', -- Ensure role is set to mentor
                    status = 'pending' -- Reset to pending if they were, e.g., disabled
                RETURNING id
            `;
            const userResult = yield client.query(userQuery, [email, hashedToken]);
            const mentorId = userResult.rows[0].id;
            const assignmentQuery = `
                INSERT INTO course_mentors (course_id, mentor_id)
                VALUES ($1, $2)
                ON CONFLICT (course_id, mentor_id) DO NOTHING
            `;
            yield client.query(assignmentQuery, [courseId, mentorId]);
            yield client.query('COMMIT');
            const completeRegistrationURL = `${process.env.FRONTED_URL || 'http://localhost:3000'}/auth/complete-registration/${invitationToken}`;
            const message = `
                <h1>You've been invited to be a Mentor at YegoSheCan!</h1>
                <p>You have been invited to mentor the course: <strong>${course.name}</strong>.</p>
                <p>Please click the link below to complete your registration and set up your account:</p>
                <a href="${completeRegistrationURL}" style="display:inline-block;background-color:#008CBA;color:white;padding:14px 25px;text-decoration:none;border-radius:8px;">Complete Your Registration</a>
            `;
            yield (0, email_1.default)({
                to: email,
                subject: `Invitation to Mentor at YegoSheCan for ${course.name}`,
                html: message,
                text: ''
            });
            return { id: mentorId, email, role: 'mentor', status: 'pending' };
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }),
    completeRegistration: (token, userData) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, username, password } = userData;
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const { rows } = yield db_1.default.query(`SELECT id, role FROM users 
             WHERE verification_token = $1 AND status = 'pending'`, [hashedToken]);
        if (rows.length === 0) {
            return { success: false, message: 'Invitation token is invalid or has already been used.' };
        }
        const user = rows[0];
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(password, salt);
        const { rows: updatedRows } = yield db_1.default.query(`UPDATE users SET 
                first_name = $1,
                last_name = $2,
                username = $3,
                password_hash = $4,
                is_verified = TRUE,
                verification_token = NULL,
                status = 'active'
             WHERE id = $5
             RETURNING id, username, email, role, status`, [firstName, lastName, username, passwordHash, user.id]);
        return { success: true, user: updatedRows[0] };
    }),
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        const { rows } = yield db_1.default.query(`SELECT id, username, email, first_name, last_name, role, status, created_at 
             FROM users ORDER BY created_at DESC`);
        return rows;
    }),
    updateUser: (userId, status, role) => __awaiter(void 0, void 0, void 0, function* () {
        const fieldsToUpdate = [];
        const values = [];
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
        const { rows } = yield db_1.default.query(updateQuery, values);
        if (rows.length === 0) {
            throw new Error('User not found.');
        }
        return rows[0];
    }),
    deleteUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query('DELETE FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0) {
            throw new Error('User not found.');
        }
        return { success: true };
    }),
    getEnrolledLearnersForCourse: (mentorId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const assignmentCheck = yield db_1.default.query('SELECT 1 FROM course_mentors WHERE mentor_id = $1 AND course_id = $2', [mentorId, courseId]);
        if (((_a = assignmentCheck.rowCount) !== null && _a !== void 0 ? _a : 0) === 0) {
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
        const { rows } = yield db_1.default.query(query, [courseId]);
        return rows;
    }),
    applyToBeMentor: (applicationData, cvFile) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, phone, expertise, education, experience, message } = applicationData;
        let cvPath = undefined;
        if (cvFile) {
            // Save the CV to a public directory
            const uploadDir = 'uploads/cvs';
            yield promises_1.default.mkdir(uploadDir, { recursive: true });
            const filename = `cv-${Date.now()}-${cvFile.originalname}`;
            const fullPath = path_1.default.join(uploadDir, filename);
            yield promises_1.default.writeFile(fullPath, cvFile.buffer);
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
        yield db_1.default.query(insertQuery, [name, email, phone, expertise, education, experience, message, cvPath]);
        const { rows: programManagers } = yield db_1.default.query("SELECT email FROM users WHERE role = 'program manager' AND status = 'active'");
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
        }
        else {
            console.warn("[Service] No CV file was provided to the service.");
        }
        yield (0, email_1.default)({
            to: recipientEmails.join(','),
            subject: subject,
            text: `New mentor application from ${name} (${email}). Their CV is attached.`,
            html: emailBody,
            attachments: attachments,
        });
        return { success: true };
    }),
    handleContactForm: (contactData) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, phone, category, message } = contactData;
        const { rows: programManagers } = yield db_1.default.query("SELECT email FROM users WHERE role = 'program manager' AND status = 'active'");
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
        yield (0, email_1.default)({
            to: recipientEmails.join(','),
            subject: subject,
            text: `New contact message from ${name} (${email}). Category: ${category}. Message: ${message}`,
            html: emailBody,
        });
        return { success: true };
    }),
    getAllMentors: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query);
        return rows.map(mentor => (Object.assign(Object.assign({}, mentor), { status: mentor.status === 'active' ? 'Active' : 'Pending' })));
    }),
    getAllLearners: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query);
        return rows.map(learner => (Object.assign(Object.assign({}, learner), { status: learner.status === 'active' ? 'Active' : learner.status === 'disabled' ? 'Inactive' : 'Pending' })));
    }),
    getPublicMentors: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query);
        return rows;
    }),
    searchEligibleMentors: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (searchQuery = '') {
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
        const { rows } = yield db_1.default.query(query, [searchValue]);
        return rows;
    }),
};
