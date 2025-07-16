import pool from '../config/db';

export const DashboardService = {
    
    getDashboardData: async () => {
        const [
            courseData,
            mentorData,
            studentData,
            kpiData
        ] = await Promise.all([
            pool.query(`
                SELECT 
                    c.id, 
                    c.name as title,
                    m.id as "mentorId",
                    CASE
                        WHEN m.id IS NOT NULL THEN m.first_name || ' ' || m.last_name
                        ELSE ''
                    END as "mentorName",
                    CASE
                        WHEN m.status = 'pending' THEN 'pending'
                        WHEN m.id IS NOT NULL THEN 'assigned'
                        ELSE 'not-assigned'
                    END as "mentorStatus"
                FROM courses c
                LEFT JOIN course_mentors cm ON c.id = cm.course_id
                LEFT JOIN users m ON cm.mentor_id = m.id AND m.role = 'mentor';
            `),


            pool.query(`
                SELECT 
                    u.id,
                    u.first_name || ' ' || u.last_name as name,
                    u.status,
                    COUNT(cm.course_id)::int as "assignedCourses"
                FROM users u
                LEFT JOIN course_mentors cm ON u.id = cm.mentor_id
                WHERE u.role = 'mentor'
                GROUP BY u.id, u.first_name, u.last_name, u.status;
            `),


            pool.query(`
                SELECT
                    u.id,
                    u.first_name || ' ' || u.last_name as name,
                    c.name as "enrolledCourse",
                    m.first_name || ' ' || m.last_name as mentor
                FROM users u
                JOIN enrollments e ON u.id = e.learner_id
                JOIN courses c ON e.course_id = c.id
                LEFT JOIN course_mentors cm ON c.id = cm.course_id
                LEFT JOIN users m ON cm.mentor_id = m.id
                WHERE u.role = 'learner';
            `),


            pool.query(`
                SELECT
                    (SELECT COUNT(*) FROM courses) as "totalCourses",
                    (SELECT COUNT(*) FROM users WHERE role = 'mentor' AND status = 'active') as "activeMentors",
                    (SELECT COUNT(*) FROM enrollments) as "enrolledStudents";
            `)
        ]);

        const processedMentors = mentorData.rows.map(m => ({
            ...m,
            status: m.status === 'disabled' ? 'Inactive' : m.status === 'active' ? 'Active' : 'pending'
        }));


        const processedStudents = studentData.rows.map(s => ({
            ...s,
            progress: Math.floor(Math.random() * 81) + 20 
        }));


        return {
            kpis: kpiData.rows[0],
            courses: courseData.rows,
            mentors: processedMentors,
            students: processedStudents
        };
    }
};