import path from 'path';
import pool from '../config/db';
import sendEmail from '../utils/email';
import fs from 'fs/promises';

export const ProgramManagerService = {
    
    getPendingApplications: async () => {
        return (await pool.query("SELECT * FROM mentor_applications WHERE status = 'pending' ORDER BY submitted_at ASC")).rows;
    },

    processApplication: async (applicationId: number, decision: 'approved' | 'declined', programManagerName: string) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                "UPDATE mentor_applications SET status = $1 WHERE id = $2 AND status = 'pending' RETURNING name, email",
                [decision, applicationId]
            );

            if (updateResult.rowCount === 0) {
                throw new Error('Application not found or already processed.');
            }
            const { name, email } = updateResult.rows[0];
            
            // Send email notification to the applicant
            let subject = '';
            let emailBody = '';

            if (decision === 'approved') {
                subject = 'Your YegoSheCan Mentor Application has been Approved!';
                emailBody = `
                    <h1>Congratulations, ${name}!</h1>
                    <p>We are thrilled to inform you that your application to become a mentor at YegoSheCan has been approved.</p>
                    <p>Our team will be in touch with you shortly via this email address to send an official invitation to the platform, where you can complete your registration and set up your mentor profile.</p>
                    <p>Welcome to the community!</p>
                `;
            } else { // Declined
                subject = 'Update on your YegoSheCan Mentor Application';
                emailBody = `
                    <h1>Update on Your Mentor Application</h1>
                    <p>Hello ${name},</p>
                    <p>Thank you for your interest in becoming a mentor at YegoSheCan and for taking the time to submit an application.</p>
                    <p>After careful review, we regret to inform you that we are unable to proceed with your application at this time. We received a large number of highly qualified applicants, and the selection process was very competitive.</p>
                    <p>We appreciate your passion for empowering women entrepreneurs and wish you all the best in your future endeavors.</p>
                `;
            }
            
            await sendEmail({
                to: email, subject, html: emailBody,
                text: ''
            });
            await client.query('COMMIT');
            return { success: true, applicantName: name };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    createPhysicalProgram: async (data: any, creatorId: number, imageFile?: Express.Multer.File) => {
        const { title, description, duration, schedule, nextSession, location, skills, requirements } = data;
        let imageUrl: string | undefined = undefined;

        if (imageFile) {
            const uploadDir = 'uploads/programs';
            await fs.mkdir(uploadDir, { recursive: true });
            const filename = `program-${Date.now()}-${imageFile.originalname}`;
            const fullPath = path.join(uploadDir, filename);
            await fs.writeFile(fullPath, imageFile.buffer);
            imageUrl = `/${uploadDir}/${filename}`;
        }

        const query = `
            INSERT INTO physical_programs (title, description, duration, schedule, next_session, location, skills, requirements, image_url, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [
            title, description, duration, schedule, nextSession, location, skills, requirements, imageUrl, creatorId
        ]);
        return rows[0];
    },


};