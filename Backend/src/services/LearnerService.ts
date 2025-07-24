import pool from '../config/db';
import sendEmail from '../utils/email';
import { format } from 'date-fns'; 

export const LearnerService = {
    
    bookMentorshipSlot: async (learnerId: number, slotId: number, topic: string) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const slotUpdateQuery = `
                UPDATE mentor_availability
                SET status = 'booked'
                WHERE id = $1 AND status = 'available'
                RETURNING mentor_id, to_char(slot_date, 'YYYY-MM-DD') as date, slot_time as time;
            `;
            const slotResult = await client.query(slotUpdateQuery, [slotId]);

            if (slotResult.rowCount === 0) {

                throw new Error('This time slot is no longer available. Please select another.');
            }
            const { mentor_id: mentorId, date, time } = slotResult.rows[0];
            

            const courseResult = await client.query(
                `SELECT c.id, c.name FROM courses c JOIN enrollments e ON c.id = e.course_id JOIN course_mentors cm ON c.id = cm.course_id WHERE e.learner_id = $1 AND cm.mentor_id = $2 LIMIT 1`,
                [learnerId, mentorId]
            );
            const courseId = courseResult.rows[0]?.id;
            if (!courseId) throw new Error('Could not find a mutual course for this booking.');
            
            
            const bookingInsertQuery = `
                INSERT INTO bookings (learner_id, mentor_id, course_id, time_slot, topic)
                VALUES ($1, $2, $3, $4, $5);
            `;
            await client.query(bookingInsertQuery, [learnerId, mentorId, courseId, `${date} at ${time}`, topic]);
            
            
            const usersQuery = `
                SELECT 
                    (SELECT first_name || ' ' || last_name FROM users WHERE id = $1) as "learnerName",
                    (SELECT email FROM users WHERE id = $1) as "learnerEmail",
                    (SELECT first_name || ' ' || last_name FROM users WHERE id = $2) as "mentorName",
                    (SELECT email FROM users WHERE id = $2) as "mentorEmail";
            `;
            const usersResult = await client.query(usersQuery, [learnerId, mentorId]);
            const { learnerName, learnerEmail, mentorName, mentorEmail } = usersResult.rows[0];

            await client.query('COMMIT'); 

            
            const meetingLink = "https://meet.google.com/mqt-yygo-jeo";
            const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');
            const formattedTime = time;

            
            const createCalendarLink = (email: string, title: string, startDate: string, startTime: string) => {
                const startDateTime = new Date(`${startDate} ${startTime.split(' ')[0]}`);
                const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 mins later
                const formatForUrl = (dt: Date) => dt.toISOString().replace(/-|:|\.\d+/g, '');
                const details = `Mentorship session for YegoSheCan. Meeting Link: ${meetingLink}`;
                return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatForUrl(startDateTime)}/${formatForUrl(endDateTime)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(meetingLink)}&add=${encodeURIComponent(email)}`;
            };
            
            // Email to Learner
            const learnerSubject = `Confirmation: Your Mentorship Session with ${mentorName}`;
            const learnerBody = `
                <h1>Your session is confirmed!</h1>
                <p>Hello ${learnerName},</p>
                <p>Your mentorship session with <strong>${mentorName}</strong> has been successfully booked.</p>
                <p><strong>Time:</strong> ${formattedDate} at ${formattedTime}</p>
                <p><strong>Topic:</strong> ${topic}</p>
                <p><strong>Join Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
                <a href="${createCalendarLink(learnerEmail, `Mentorship with ${mentorName}`, date, time)}" style="display:inline-block;background-color:#4c1d95;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Add to Google Calendar</a>
            `;
            await sendEmail({
                to: learnerEmail, subject: learnerSubject, html: learnerBody,
                text: ''
            });

            // Email to Mentor
            const mentorSubject = `New Mentorship Session Booked with ${learnerName}`;
            const mentorBody = `
                <h1>New Booking!</h1>
                <p>Hello ${mentorName},</p>
                <p>A new mentorship session has been booked by <strong>${learnerName}</strong>.</p>
                <p><strong>Time:</strong> ${formattedDate} at ${formattedTime}</p>
                <p><strong>Topic:</strong> ${topic}</p>
                <p><strong>Join Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
                <a href="${createCalendarLink(mentorEmail, `Mentorship with ${learnerName}`, date, time)}" style="display:inline-block;background-color:#4c1d95;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Add to Google Calendar</a>
            `;
            await sendEmail({
                to: mentorEmail, subject: mentorSubject, html: mentorBody,
                text: ''
            });

            return { success: true };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};