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
exports.MentorService = void 0;
const db_1 = __importDefault(require("../config/db"));
const email_1 = __importDefault(require("../utils/email"));
exports.MentorService = {
    getDashboardData: (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            WITH MentorCourseIDs AS (
                -- Step 1: Get a definitive list of this mentor's course IDs.
                SELECT course_id FROM course_mentors WHERE mentor_id = $1
            )
            -- Step 2: Run all our calculations in parallel using this authorized list.
            SELECT
                -- KPIs (these are correct)
                (SELECT COUNT(*) FROM MentorCourseIDs) as "totalCourses",
                (SELECT COUNT(DISTINCT learner_id) FROM enrollments WHERE course_id IN (SELECT course_id FROM MentorCourseIDs)) as "totalStudents",
                (SELECT COUNT(ch.id) FROM chapters ch JOIN resources r ON ch.resource_id = r.id WHERE r.course_id IN (SELECT course_id FROM MentorCourseIDs)) as "totalChapters",
                (SELECT COUNT(DISTINCT c.id) FROM courses c JOIN resources r ON c.id = r.course_id JOIN quizzes q ON r.id = q.resource_id JOIN quiz_attempts qa ON q.id = qa.quiz_id WHERE c.id IN (SELECT course_id FROM MentorCourseIDs) AND q.is_final = TRUE AND qa.passed = TRUE) as "completedCourses",

                -- Detailed list of assigned courses (this is correct)
                (
                    SELECT json_agg(course_details) FROM (
                        SELECT c.id, c.name as title, r.level, r.timeline as duration,
                               (SELECT COUNT(*) FROM chapters ch WHERE ch.resource_id = r.id)::int as chapters,
                               (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id)::int as "studentsEnrolled"
                        FROM courses c
                        LEFT JOIN resources r ON c.id = r.course_id
                        WHERE c.id IN (SELECT course_id FROM MentorCourseIDs)
                          AND (r.id = (SELECT id FROM resources res WHERE res.course_id = c.id ORDER BY res.created_at DESC LIMIT 1) OR r.id IS NULL)
                        ORDER BY c.name
                    ) as course_details
                ) as courses,
                
                -- --- THIS IS THE CORRECTED QUIZ OVERVIEW QUERY ---
                (
                    SELECT json_agg(quiz_details) FROM (
                        SELECT q.id, CASE WHEN q.is_final THEN c.name || ' - Final Quiz' ELSE ch.title END as title,
                               c.name as course,
                               (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id)::int as expected,
                               COALESCE(att.attempted, 0)::int as attempted,
                               COALESCE(att.passed, 0)::int as passed,
                               COALESCE(att.failed, 0)::int as failed
                        FROM quizzes q
                        JOIN resources r ON q.resource_id = r.id
                        JOIN courses c ON r.course_id = c.id
                        LEFT JOIN chapters ch ON q.chapter_id = ch.id
                        LEFT JOIN (
                            SELECT quiz_id, COUNT(DISTINCT learner_id) as attempted, SUM(CASE WHEN passed THEN 1 ELSE 0 END) as passed, SUM(CASE WHEN NOT passed THEN 1 ELSE 0 END) as failed
                            FROM quiz_attempts GROUP BY quiz_id
                        ) as att ON q.id = att.quiz_id
                        WHERE 
                            c.id IN (SELECT course_id FROM MentorCourseIDs)
                            -- This condition ensures we only look at quizzes from the LATEST resource for each course
                            AND r.id = (
                                SELECT id FROM resources res 
                                WHERE res.course_id = c.id 
                                ORDER BY res.created_at DESC 
                                LIMIT 1
                            )
                        ORDER BY c.name, q.is_final
                    ) as quiz_details
                ) as quizzes,
                -- ---------------------------------------------------

                -- Bookings query (this is correct)
                (
                    SELECT json_agg(booking_details) FROM (
                        SELECT b.id, u.first_name || ' ' || u.last_name as student, c.name as course, b.time_slot as time, b.topic
                        FROM bookings b
                        JOIN users u ON b.learner_id = u.id
                        JOIN courses c ON b.course_id = c.id
                        WHERE b.mentor_id = $1
                        ORDER BY b.created_at DESC
                    ) as booking_details
                ) as bookings;
        `;
        const { rows } = yield db_1.default.query(query, [mentorId]);
        const data = rows[0];
        return {
            kpis: {
                totalCourses: data.totalCourses || 0,
                totalStudents: data.totalStudents || 0,
                totalChapters: data.totalChapters || 0,
                completedCourses: data.completedCourses || 0,
            },
            courses: data.courses || [],
            quizzes: data.quizzes || [],
            bookings: data.bookings || [],
        };
    }),
    messageLearner: (mentorId, learnerId, courseId, message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const authQuery = `
            SELECT 
                (SELECT 1 FROM course_mentors WHERE mentor_id = $1 AND course_id = $3) as "isMentor",
                (SELECT 1 FROM enrollments WHERE learner_id = $2 AND course_id = $3) as "isLearner"
        `;
        const authResult = yield db_1.default.query(authQuery, [mentorId, learnerId, courseId]);
        if (!((_a = authResult.rows[0]) === null || _a === void 0 ? void 0 : _a.isMentor) || !((_b = authResult.rows[0]) === null || _b === void 0 ? void 0 : _b.isLearner)) {
            throw new Error('Forbidden: You are not authorized to message this learner for this course.');
        }
        const usersQuery = `
            SELECT 
                (SELECT first_name || ' ' || last_name FROM users WHERE id = $1) as "mentorName",
                (SELECT email FROM users WHERE id = $2) as "learnerEmail";
        `;
        const usersResult = yield db_1.default.query(usersQuery, [mentorId, learnerId]);
        const { mentorName, learnerEmail } = usersResult.rows[0];
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
        yield (0, email_1.default)({
            to: learnerEmail,
            subject: subject,
            text: `Message from your mentor, ${mentorName}: ${message}`,
            html: emailBody,
        });
        return { success: true };
    }),
    getAvailability: (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT id, to_char(slot_date, 'YYYY-MM-DD') as date, slot_time as time, status
            FROM mentor_availability
            WHERE mentor_id = $1
            ORDER BY slot_date, slot_time;
        `;
        const { rows } = yield db_1.default.query(query, [mentorId]);
        return rows.map(slot => (Object.assign(Object.assign({}, slot), { status: slot.status.charAt(0).toUpperCase() + slot.status.slice(1) })));
    }),
    addAvailability: (mentorId, date, times) => __awaiter(void 0, void 0, void 0, function* () {
        if (!times || times.length === 0) {
            throw new Error('No time slots provided.');
        }
        const client = yield db_1.default.connect();
        try {
            yield client.query('BEGIN');
            const createdSlots = [];
            for (const time of times) {
                const query = `
                    INSERT INTO mentor_availability (mentor_id, slot_date, slot_time)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (mentor_id, slot_date, slot_time) DO NOTHING
                    RETURNING id, to_char(slot_date, 'YYYY-MM-DD') as date, slot_time as time, status;
                `;
                const result = yield client.query(query, [mentorId, date, time]);
                if (result.rows[0]) {
                    createdSlots.push(result.rows[0]);
                }
            }
            yield client.query('COMMIT');
            return createdSlots;
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }),
    updateSlotStatus: (mentorId, slotId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            UPDATE mentor_availability
            SET status = $1
            WHERE id = $2 AND mentor_id = $3
            RETURNING id;
        `;
        const result = yield db_1.default.query(query, [newStatus, slotId, mentorId]);
        if (result.rowCount === 0) {
            throw new Error('Slot not found or you are not authorized to modify it.');
        }
        return { success: true, slotId, newStatus };
    }),
    deleteSlot: (mentorId, slotId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = 'DELETE FROM mentor_availability WHERE id = $1 AND mentor_id = $2';
        const result = yield db_1.default.query(query, [slotId, mentorId]);
        if (result.rowCount === 0) {
            throw new Error('Slot not found or you are not authorized to delete it.');
        }
        return { success: true, slotId };
    }),
    getMentorAvailability: (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT id, to_char(slot_date, 'YYYY-MM-DD') as date, slot_time as time, status
            FROM mentor_availability
            WHERE mentor_id = $1 AND status = 'available' -- Only fetch slots that can be booked
            ORDER BY slot_date, slot_time;
        `;
        const { rows } = yield db_1.default.query(query, [mentorId]);
        return rows.map(slot => (Object.assign(Object.assign({}, slot), { status: slot.status.charAt(0).toUpperCase() + slot.status.slice(1) })));
    }),
};
