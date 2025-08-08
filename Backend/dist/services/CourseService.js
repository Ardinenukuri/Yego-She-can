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
exports.CourseService = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.CourseService = {
    createCourse: (name, creatorId) => __awaiter(void 0, void 0, void 0, function* () {
        const { rows } = yield db_1.default.query('INSERT INTO courses (name, created_by) VALUES ($1, $2) RETURNING id, name', [name, creatorId]);
        return rows[0];
    }),
    getAllCourses: () => __awaiter(void 0, void 0, void 0, function* () {
        const { rows } = yield db_1.default.query('SELECT id, name FROM courses ORDER BY name ASC');
        return rows;
    }),
    getCourseById: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const { rows } = yield db_1.default.query('SELECT id, name FROM courses WHERE id = $1', [courseId]);
        return rows[0] || null;
    }),
    deleteCourse: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query('DELETE FROM courses WHERE id = $1', [courseId]);
        if (result.rowCount === 0) {
            throw new Error('Course not found.');
        }
        return { success: true };
    }),
    getAllCoursesForLearner: (learnerId) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query, [learnerId]);
        return rows.map(course => (Object.assign(Object.assign({}, course), { price: 'Free', features: course.features || [] })));
    }),
    enrollInCourse: (learnerId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const courseCheck = yield db_1.default.query('SELECT id FROM courses WHERE id = $1', [courseId]);
        if (courseCheck.rowCount === 0) {
            throw new Error('Course not found.');
        }
        try {
            const { rows } = yield db_1.default.query('INSERT INTO enrollments (learner_id, course_id) VALUES ($1, $2) RETURNING *', [learnerId, courseId]);
            return { success: true, enrollment: rows[0] };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('You are already enrolled in this course.');
            }
            throw error;
        }
    }),
    getPublicCourses: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query);
        return rows.map(course => (Object.assign(Object.assign({}, course), { price: 'Free', features: course.features || [] })));
    }),
    getAdminCourseList: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query);
        return rows.map(course => (Object.assign(Object.assign({}, course), { price: 'Free' })));
    }),
    getEnrolledCoursesForLearner: (learnerId) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { rows } = yield db_1.default.query(query, [learnerId]);
        return rows.map(course => (Object.assign(Object.assign({}, course), { slug: course.title.toLowerCase().replace(/\s+/g, '-'), price: 'Free', features: course.features || [] })));
    }),
    getCourseLearningData: (courseId, learnerId) => __awaiter(void 0, void 0, void 0, function* () {
        const enrollmentCheck = yield db_1.default.query('SELECT * FROM enrollments WHERE course_id = $1 AND learner_id = $2', [courseId, learnerId]);
        if (enrollmentCheck.rowCount === 0) {
            throw new Error('Forbidden: You are not enrolled in this course.');
        }
        const courseQuery = `
        SELECT
            c.id,
            c.name AS title,
            r.description,
            r.id AS "resourceId",
            r.video_link AS "videoLink"  -- <<< THE FIX IS HERE
        FROM courses c
        JOIN resources r ON c.id = r.course_id
        WHERE c.id = $1
        ORDER BY r.created_at DESC LIMIT 1;
    `;
        const courseResult = yield db_1.default.query(courseQuery, [courseId]);
        if (courseResult.rowCount === 0) {
            throw new Error('Course content not found.');
        }
        const courseData = courseResult.rows[0];
        const chaptersQuery = `
        SELECT
            ch.id,
            ch.title,
            ch.content,
            q.id as "quizId",
            EXISTS (
                SELECT 1 FROM user_chapter_progress ucp
                WHERE ucp.chapter_id = ch.id AND ucp.learner_id = $1
            ) as "isCompleted",
            EXISTS (
                SELECT 1 FROM quiz_attempts qa
                WHERE qa.quiz_id = q.id AND qa.learner_id = $1 AND qa.passed = TRUE
            ) as "quizPassed"
        FROM chapters ch
        LEFT JOIN quizzes q ON ch.id = q.chapter_id
        WHERE ch.resource_id = $2
        ORDER BY ch.chapter_number ASC;
    `;
        const chaptersResult = yield db_1.default.query(chaptersQuery, [learnerId, courseData.resourceId]);
        const finalQuizQuery = `
        SELECT 
            q.id as "quizId",
            EXISTS (
                SELECT 1 FROM quiz_attempts qa
                WHERE qa.quiz_id = q.id AND qa.learner_id = $1 AND qa.passed = TRUE
            ) as "isCompleted"
        FROM quizzes q
        WHERE q.resource_id = $2 AND q.is_final = TRUE;
    `;
        const finalQuizResult = yield db_1.default.query(finalQuizQuery, [learnerId, courseData.resourceId]);
        return Object.assign(Object.assign({}, courseData), { chapters: chaptersResult.rows, finalQuiz: finalQuizResult.rows[0] || null });
    }),
    toggleChapterCompletion: (learnerId, chapterId) => __awaiter(void 0, void 0, void 0, function* () {
        const authQuery = `
            SELECT ch.id FROM chapters ch
            JOIN resources r ON ch.resource_id = r.id
            JOIN enrollments e ON r.course_id = e.course_id
            WHERE ch.id = $1 AND e.learner_id = $2
        `;
        const authResult = yield db_1.default.query(authQuery, [chapterId, learnerId]);
        if (authResult.rowCount === 0) {
            throw new Error('Forbidden: Chapter not found or you are not enrolled in this course.');
        }
        const checkResult = yield db_1.default.query('SELECT 1 FROM user_chapter_progress WHERE learner_id = $1 AND chapter_id = $2', [learnerId, chapterId]);
        if (checkResult.rowCount) {
            yield db_1.default.query('DELETE FROM user_chapter_progress WHERE learner_id = $1 AND chapter_id = $2', [learnerId, chapterId]);
            return { completed: false };
        }
        else {
            yield db_1.default.query('INSERT INTO user_chapter_progress (learner_id, chapter_id) VALUES ($1, $2)', [learnerId, chapterId]);
            return { completed: true };
        }
    }),
    getCoursesForMentor: (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT DISTINCT ON (c.id)
                c.id,
                c.name as title,
                r.description,
                r.timeline as duration,
                r.level,
                r.image_url as image,
                u.first_name || ' ' || u.last_name as mentor,
                (
                    SELECT COUNT(*) 
                    FROM chapters ch 
                    WHERE ch.resource_id = r.id
                )::int as lessons,
                'active' as status
            FROM
                course_mentors cm
            JOIN 
                courses c ON cm.course_id = c.id
            JOIN 
                users u ON cm.mentor_id = u.id
            LEFT JOIN 
                resources r ON c.id = r.course_id
            WHERE
                cm.mentor_id = $1
            ORDER BY
                c.id, r.created_at DESC; -- Sort by course, then newest resource first
        `;
        const { rows } = yield db_1.default.query(query, [mentorId]);
        return rows;
    }),
    getChaptersForCourse: (courseId, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            WITH LatestResource AS (
                -- Step 1: Find the ID of the most recently uploaded resource for this course.
                SELECT id FROM resources
                WHERE course_id = $1
                ORDER BY created_at DESC
                LIMIT 1
            )
            -- Step 2: Fetch chapters only if the mentor is assigned to the course AND chapters exist for the latest resource.
            SELECT ch.id, ch.title
            FROM chapters ch
            WHERE 
                ch.resource_id = (SELECT id FROM LatestResource)
                AND EXISTS (
                    -- Authorization check
                    SELECT 1 FROM course_mentors 
                    WHERE course_id = $1 AND mentor_id = $2
                )
            ORDER BY ch.chapter_number;
        `;
        const { rows } = yield db_1.default.query(query, [courseId, mentorId]);
        return rows;
    }),
    getCourseDetailsForAdmin: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const courseQuery = 'SELECT id, name FROM courses WHERE id = $1';
        const courseResult = yield db_1.default.query(courseQuery, [courseId]);
        if (((_a = courseResult.rowCount) !== null && _a !== void 0 ? _a : 0) === 0) {
            const error = new Error('Course not found.');
            error.name = 'NotFoundError';
            throw error;
        }
        const course = courseResult.rows[0];
        const learnersQuery = `
        SELECT
            u.id,
            u.first_name || ' ' || u.last_name as name,
            u.profile_picture_url as image,
            e.enrolled_at as enrolled,

            (
                SELECT COUNT(ch.id) FROM chapters ch
                WHERE ch.resource_id = (
                    SELECT r.id FROM resources r
                    WHERE r.course_id = $1
                    ORDER BY r.created_at DESC LIMIT 1
                )
            )::int as "totalLessons",

            (
                SELECT COUNT(ucp.chapter_id) FROM user_chapter_progress ucp
                JOIN chapters ch ON ucp.chapter_id = ch.id
                WHERE ucp.learner_id = u.id AND ch.resource_id = (
                    SELECT r.id FROM resources r
                    WHERE r.course_id = $1
                    ORDER BY r.created_at DESC LIMIT 1
                )
            )::int as "lessonsCompleted"

            -- The "finalQuizPassed" EXISTS check has been REMOVED from this query.
        FROM
            users u
        JOIN
            enrollments e ON u.id = e.learner_id
        WHERE
            e.course_id = $1 AND u.role = 'learner'
        ORDER BY
            name;
    `;
        const learnersResult = yield db_1.default.query(learnersQuery, [courseId]);
        const learners = learnersResult.rows.map(learner => {
            const progress = learner.totalLessons > 0 ? Math.round((learner.lessonsCompleted / learner.totalLessons) * 100) : 0;
            const certificateEligible = progress >= 100;
            return Object.assign(Object.assign({}, learner), { progress,
                certificateEligible });
        });
        return Object.assign(Object.assign({}, course), { learners });
    }),
    getCourseDetailsForMentor: (courseId, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT c.id, c.name
            FROM courses c
            JOIN course_mentors cm ON c.id = cm.course_id
            WHERE c.id = $1 AND cm.mentor_id = $2;
        `;
        const result = yield db_1.default.query(query, [courseId, mentorId]);
        if (result.rowCount === 0) {
            throw new Error('Course not found or you are not authorized to view it.');
        }
        return result.rows[0];
    }),
};
