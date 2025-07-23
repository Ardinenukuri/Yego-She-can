import pool from '../config/db';
import sendEmail from '../utils/email';

export const MentorService = {
    
    getDashboardData: async (mentorId: number) => {
        const query = `
            WITH MentorCourses AS (
                -- Step 1: Get a definitive list of this mentor's course IDs.
                SELECT course_id FROM course_mentors WHERE mentor_id = $1
            )
            -- Step 2: Run all our calculations in parallel using this authorized list.
            SELECT
                -- KPI: Total assigned courses
                (SELECT COUNT(*) FROM MentorCourses) as "totalCourses",
                
                -- KPI: Total unique students across all assigned courses
                (SELECT COUNT(DISTINCT learner_id) FROM enrollments WHERE course_id IN (SELECT course_id FROM MentorCourses)) as "totalStudents",
                
                -- KPI: Total chapters across all resources for assigned courses
                (
                    SELECT COUNT(ch.id) 
                    FROM chapters ch
                    JOIN resources r ON ch.resource_id = r.id
                    WHERE r.course_id IN (SELECT course_id FROM MentorCourses)
                ) as "totalChapters",
                
                -- KPI: Total courses where at least one student passed the final quiz
                (
                    SELECT COUNT(DISTINCT c.id)
                    FROM courses c
                    JOIN resources r ON c.id = r.course_id
                    JOIN quizzes q ON r.id = q.resource_id
                    JOIN quiz_attempts qa ON q.id = qa.quiz_id
                    WHERE c.id IN (SELECT course_id FROM MentorCourses)
                      AND q.is_final = TRUE
                      AND qa.passed = TRUE
                ) as "completedCourses",

                -- Main Data: The detailed list of courses
                (
                    SELECT json_agg(course_details)
                    FROM (
                        SELECT
                            c.id,
                            c.name as title,
                            r.level,
                            r.timeline as duration,
                            (SELECT COUNT(*) FROM chapters ch WHERE ch.resource_id = r.id)::int as chapters,
                            (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id)::int as "studentsEnrolled",
                            'active' as status -- Static for now
                        FROM courses c
                        LEFT JOIN resources r ON c.id = r.course_id
                        WHERE c.id IN (SELECT course_id FROM MentorCourses)
                        -- Ensure we only get one row per course, based on the latest resource
                        AND (r.id = (SELECT id FROM resources res WHERE res.course_id = c.id ORDER BY res.created_at DESC LIMIT 1) OR r.id IS NULL)
                        ORDER BY c.name
                    ) as course_details
                ) as courses;
        `;
        
        const { rows } = await pool.query(query, [mentorId]);

        // The query returns one row with all data aggregated.
        // We structure it for the frontend.
        const data = rows[0];
        return {
            kpis: {
                totalCourses: data.totalCourses || 0,
                totalStudents: data.totalStudents || 0,
                totalChapters: data.totalChapters || 0,
                completedCourses: data.completedCourses || 0,
            },
            courses: data.courses || [], // Ensure courses is an empty array if null
        };
    },

    messageLearner: async (mentorId: number, learnerId: number, courseId: number, message: string) => {
        // 1. Authorize: Ensure the mentor and learner are both linked to the specified course.
        // This is a crucial security check.
        const authQuery = `
            SELECT 
                (SELECT 1 FROM course_mentors WHERE mentor_id = $1 AND course_id = $3) as "isMentor",
                (SELECT 1 FROM enrollments WHERE learner_id = $2 AND course_id = $3) as "isLearner"
        `;
        const authResult = await pool.query(authQuery, [mentorId, learnerId, courseId]);

        if (!authResult.rows[0]?.isMentor || !authResult.rows[0]?.isLearner) {
            throw new Error('Forbidden: You are not authorized to message this learner for this course.');
        }

        // 2. Get mentor's name and learner's email.
        const usersQuery = `
            SELECT 
                (SELECT first_name || ' ' || last_name FROM users WHERE id = $1) as "mentorName",
                (SELECT email FROM users WHERE id = $2) as "learnerEmail";
        `;
        const usersResult = await pool.query(usersQuery, [mentorId, learnerId]);
        const { mentorName, learnerEmail } = usersResult.rows[0];

        // 3. Prepare and send the email.
        const subject = `A Message from Your Mentor, ${mentorName}, regarding your course`;
        const emailBody = `
            <h1>Message from Your YegoSheCan Mentor</h1>
            <p>Hello,</p>
            <p>Your mentor, <strong>${mentorName}</strong>, has sent you the following message:</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #4c1d95; border-radius: 5px; margin: 20px 0;">
                <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p>You can log in to your dashboard to continue your learning journey.</p>
            <br>
            <p>Best regards,</p>
            <p>The YegoSheCan Team</p>
        `;

        await sendEmail({
            to: learnerEmail,
            subject: subject,
            text: `Message from your mentor, ${mentorName}: ${message}`,
            html: emailBody,
        });

        return { success: true };
    },
};