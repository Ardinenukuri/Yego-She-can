import pool from '../config/db';

export const CourseService = {
    
    createCourse: async (name: string, creatorId: number) => {
        const { rows } = await pool.query(
            'INSERT INTO courses (name, created_by) VALUES ($1, $2) RETURNING id, name',
            [name, creatorId]
        );
        return rows[0];
    },

    
    getAllCourses: async () => {
        const { rows } = await pool.query('SELECT id, name FROM courses ORDER BY name ASC');
        return rows;
    },

    getCourseById: async (courseId: number) => {
        const { rows } = await pool.query('SELECT id, name FROM courses WHERE id = $1', [courseId]);
        return rows[0] || null;
    },

    deleteCourse: async (courseId: number): Promise<{ success: boolean }> => {
        const result = await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);
        if (result.rowCount === 0) {
            throw new Error('Course not found.');
        }
        return { success: true };
    },

    getAllCoursesForLearner: async (learnerId: number) => {
        const query = `
            SELECT 
                c.id, 
                c.name,
                -- Check if an enrollment exists for this learner and course
                EXISTS (
                    SELECT 1 FROM enrollments e 
                    WHERE e.course_id = c.id AND e.learner_id = $1
                ) as "isEnrolled"
            FROM courses c
            ORDER BY c.name ASC
        `;
        const { rows } = await pool.query(query, [learnerId]);
        return rows;
    },


    enrollInCourse: async (learnerId: number, courseId: number) => {
        const courseCheck = await pool.query('SELECT id FROM courses WHERE id = $1', [courseId]);
        if (courseCheck.rowCount === 0) {
            throw new Error('Course not found.');
        }

        try {
            const { rows } = await pool.query(
                'INSERT INTO enrollments (learner_id, course_id) VALUES ($1, $2) RETURNING *',
                [learnerId, courseId]
            );
            return { success: true, enrollment: rows[0] };
        } catch (error: any) {
            if (error.code === '23505') {
                throw new Error('You are already enrolled in this course.');
            }
            throw error;
        }
    },

    getPublicCourses: async () => {

        const query = `
            SELECT DISTINCT ON (c.id)
                c.id,
                c.name as title,
                r.description,
                r.timeline as duration,
                r.level,
                r.image_url as image,
                (
                    SELECT json_agg(ch.title ORDER BY ch.chapter_number)
                    FROM chapters ch
                    WHERE ch.resource_id = r.id
                ) as features,
                (
                    SELECT COUNT(*)
                    FROM chapters ch
                    WHERE ch.resource_id = r.id
                ) as lessons
            FROM 
                courses c
            JOIN 
                resources r ON c.id = r.course_id
            ORDER BY 
                c.id, r.created_at DESC;
        `;

        const { rows } = await pool.query(query);

        return rows.map(course => ({
            ...course,
            price: 'Free', 
            features: course.features || [], 
        }));
    },

    getAdminCourseList: async () => {
        const query = `
            SELECT DISTINCT ON (c.id)
                c.id,
                c.name as title,
                r.image_url as image,
                r.description,
                r.timeline as duration,
                r.level,
                COALESCE(m.first_name || ' ' || m.last_name, 'Not Assigned') as mentor,
                (
                    SELECT COUNT(*) 
                    FROM enrollments e 
                    WHERE e.course_id = c.id
                )::int as "enrolledCount",
                (
                    SELECT COUNT(*) 
                    FROM chapters ch 
                    WHERE ch.resource_id = r.id
                )::int as lessons
            FROM
                courses c
            LEFT JOIN 
                resources r ON c.id = r.course_id
            LEFT JOIN 
                course_mentors cm ON c.id = cm.course_id
            LEFT JOIN 
                users m ON cm.mentor_id = m.id
            ORDER BY
                c.id,
                CASE WHEN m.id IS NOT NULL THEN 0 ELSE 1 END, -- Prioritize rows with a mentor
                r.created_at DESC; -- Then by the newest resource
        `;
        
        const { rows } = await pool.query(query);


        return rows.map(course => ({
            ...course,
            price: 'Free',
        }));
    },
};