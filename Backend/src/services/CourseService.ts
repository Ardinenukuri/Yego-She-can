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
                )::int as lessons,
                -- Crucially, we add the enrollment check here
                EXISTS (
                    SELECT 1 FROM enrollments e 
                    WHERE e.course_id = c.id AND e.learner_id = $1
                ) as "isEnrolled"
            FROM 
                courses c
            JOIN 
                resources r ON c.id = r.course_id
            ORDER BY 
                c.id, r.created_at DESC;
        `;

        const { rows } = await pool.query(query, [learnerId]);


        return rows.map(course => ({
            ...course,
            price: 'Free', 
            features: course.features || [], 
        }));
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

    getEnrolledCoursesForLearner: async (learnerId: number) => {
        const query = `
            SELECT DISTINCT ON (c.id)
                c.id,
                c.name as title,
                r.description,
                r.timeline as duration,
                r.level,
                r.image_url as image,
                (
                    SELECT COUNT(*) FROM chapters ch WHERE ch.resource_id = r.id
                )::int as lessons,
                
                -- --- THIS IS THE CORRECTED PROGRESS CALCULATION ---
                (
                    SELECT COUNT(*) FROM (
                        -- Get all manually completed chapter IDs for this resource
                        SELECT ucp.chapter_id
                        FROM user_chapter_progress ucp
                        JOIN chapters ch ON ucp.chapter_id = ch.id
                        WHERE ucp.learner_id = e.learner_id AND ch.resource_id = r.id
                        
                        UNION -- UNION automatically removes duplicates
                        
                        -- Get all chapter IDs with passed quizzes for this resource
                        SELECT q.chapter_id
                        FROM quiz_attempts qa
                        JOIN quizzes q ON qa.quiz_id = q.id
                        WHERE qa.learner_id = e.learner_id 
                          AND q.resource_id = r.id 
                          AND qa.passed = TRUE
                          AND q.chapter_id IS NOT NULL
                    ) AS completed_lessons
                )::int as "lessonsCompleted",
                -- --------------------------------------------------

                (
                    SELECT json_agg(ch.title ORDER BY ch.chapter_number)
                    FROM chapters ch
                    WHERE ch.resource_id = r.id
                ) as features
            FROM
                enrollments e
            JOIN
                courses c ON e.course_id = c.id
            LEFT JOIN 
                resources r ON c.id = r.course_id
            WHERE
                e.learner_id = $1 AND r.id IS NOT NULL
            ORDER BY
                c.id, r.created_at DESC;
        `;
        
        const { rows } = await pool.query(query, [learnerId]);

        return rows.map(course => ({
            ...course,
            slug: course.title.toLowerCase().replace(/\s+/g, '-'),
            price: 'Free',
            features: course.features || [],
        }));
    },

    getCourseLearningData: async (courseId: number, learnerId: number) => {
        // 1. Authorize: Ensure the learner is enrolled in this course.
        const enrollmentCheck = await pool.query(
            'SELECT * FROM enrollments WHERE course_id = $1 AND learner_id = $2',
            [courseId, learnerId]
        );
        if (enrollmentCheck.rowCount === 0) {
            throw new Error('Forbidden: You are not enrolled in this course.');
        }

        // 2. Get the main course and resource details.
        const courseQuery = `
            SELECT 
                c.id, c.name as title, r.description, r.id as "resourceId"
            FROM courses c
            JOIN resources r ON c.id = r.course_id
            WHERE c.id = $1
            ORDER BY r.created_at DESC LIMIT 1;
        `;
        const courseResult = await pool.query(courseQuery, [courseId]);
        if (courseResult.rowCount === 0) throw new Error('Course content not found.');
        const courseData = courseResult.rows[0];

        // 3. Get all chapters and their quiz status/progress for this learner.
        const chaptersQuery = `
    SELECT
        ch.id,
        ch.title,
        ch.content,
        q.id as "quizId",
        -- A chapter is completed ONLY if it has been manually marked as done.
        EXISTS (
            SELECT 1 FROM user_chapter_progress ucp
            WHERE ucp.chapter_id = ch.id AND ucp.learner_id = $1
        ) as "isCompleted",
        -- We also check if the quiz specifically has been passed.
        EXISTS (
            SELECT 1 FROM quiz_attempts qa
            WHERE qa.quiz_id = q.id AND qa.learner_id = $1 AND qa.passed = TRUE
        ) as "quizPassed"
    FROM chapters ch
    LEFT JOIN quizzes q ON ch.id = q.chapter_id
    WHERE ch.resource_id = $2
    ORDER BY ch.chapter_number ASC;
`;
const chaptersResult = await pool.query(chaptersQuery, [learnerId, courseData.resourceId]);
        
        // 4. Get the final quiz and its status for this learner.
        const finalQuizQuery = `
            SELECT 
                q.id as "quizId",
                EXISTS (
                    SELECT 1 FROM quiz_attempts qa
                    WHERE qa.quiz_id = q.id AND qa.learner_id = $1 AND qa.passed = TRUE
                ) as "isCompleted"
            FROM quizzes q
            WHERE q.resource_id = $1 AND q.is_final = TRUE;
        `;
        const finalQuizResult = await pool.query(finalQuizQuery, [courseData.resourceId]);

        return {
            ...courseData,
            chapters: chaptersResult.rows,
            finalQuiz: finalQuizResult.rows[0] || null,
        };
    },

    toggleChapterCompletion: async (learnerId: number, chapterId: number) => {
        
        const authQuery = `
            SELECT ch.id FROM chapters ch
            JOIN resources r ON ch.resource_id = r.id
            JOIN enrollments e ON r.course_id = e.course_id
            WHERE ch.id = $1 AND e.learner_id = $2
        `;
        const authResult = await pool.query(authQuery, [chapterId, learnerId]);
        if (authResult.rowCount === 0) {
            throw new Error('Forbidden: Chapter not found or you are not enrolled in this course.');
        }

        const checkResult = await pool.query(
            'SELECT 1 FROM user_chapter_progress WHERE learner_id = $1 AND chapter_id = $2',
            [learnerId, chapterId]
        );

        if (checkResult.rowCount) { 

            await pool.query(
                'DELETE FROM user_chapter_progress WHERE learner_id = $1 AND chapter_id = $2',
                [learnerId, chapterId]
            );
            return { completed: false };
        } else {

            await pool.query(
                'INSERT INTO user_chapter_progress (learner_id, chapter_id) VALUES ($1, $2)',
                [learnerId, chapterId]
            );
            return { completed: true };
        }

    },
};