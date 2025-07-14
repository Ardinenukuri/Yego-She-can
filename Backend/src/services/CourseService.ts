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
};