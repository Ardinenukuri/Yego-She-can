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
exports.LearnerService = void 0;
const db_1 = __importDefault(require("../config/db"));
const email_1 = __importDefault(require("../utils/email"));
const date_fns_1 = require("date-fns");
exports.LearnerService = {
    bookMentorshipSlot: (learnerId, slotId, topic) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const client = yield db_1.default.connect();
        try {
            yield client.query('BEGIN');
            const slotUpdateQuery = `
                UPDATE mentor_availability
                SET status = 'booked'
                WHERE id = $1 AND status = 'available'
                RETURNING mentor_id, to_char(slot_date, 'YYYY-MM-DD') as date, slot_time as time;
            `;
            const slotResult = yield client.query(slotUpdateQuery, [slotId]);
            if (slotResult.rowCount === 0) {
                throw new Error('This time slot is no longer available. Please select another.');
            }
            const { mentor_id: mentorId, date, time } = slotResult.rows[0];
            const courseResult = yield client.query(`SELECT c.id, c.name FROM courses c JOIN enrollments e ON c.id = e.course_id JOIN course_mentors cm ON c.id = cm.course_id WHERE e.learner_id = $1 AND cm.mentor_id = $2 LIMIT 1`, [learnerId, mentorId]);
            const courseId = (_a = courseResult.rows[0]) === null || _a === void 0 ? void 0 : _a.id;
            if (!courseId)
                throw new Error('Could not find a mutual course for this booking.');
            const bookingInsertQuery = `
                INSERT INTO bookings (learner_id, mentor_id, course_id, time_slot, topic)
                VALUES ($1, $2, $3, $4, $5);
            `;
            yield client.query(bookingInsertQuery, [learnerId, mentorId, courseId, `${date} at ${time}`, topic]);
            const usersQuery = `
                SELECT 
                    (SELECT first_name || ' ' || last_name FROM users WHERE id = $1) as "learnerName",
                    (SELECT email FROM users WHERE id = $1) as "learnerEmail",
                    (SELECT first_name || ' ' || last_name FROM users WHERE id = $2) as "mentorName",
                    (SELECT email FROM users WHERE id = $2) as "mentorEmail";
            `;
            const usersResult = yield client.query(usersQuery, [learnerId, mentorId]);
            const { learnerName, learnerEmail, mentorName, mentorEmail } = usersResult.rows[0];
            yield client.query('COMMIT');
            const meetingLink = "https://meet.google.com/mqt-yygo-jeo";
            const formattedDate = (0, date_fns_1.format)(new Date(date), 'EEEE, MMMM d, yyyy');
            const formattedTime = time;
            const createCalendarLink = (email, title, startDate, startTime) => {
                const startDateTime = new Date(`${startDate} ${startTime.split(' ')[0]}`);
                const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 mins later
                const formatForUrl = (dt) => dt.toISOString().replace(/-|:|\.\d+/g, '');
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
            yield (0, email_1.default)({
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
            yield (0, email_1.default)({
                to: mentorEmail, subject: mentorSubject, html: mentorBody,
                text: ''
            });
            return { success: true };
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }),
    getPhysicalPrograms: (learnerId) => __awaiter(void 0, void 0, void 0, function* () {
        const enrolledCoursesQuery = `
            SELECT c.id FROM courses c
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.learner_id = $1;
        `;
        const enrolledCoursesResult = yield db_1.default.query(enrolledCoursesQuery, [learnerId]);
        const enrolledCourseIds = enrolledCoursesResult.rows.map(row => row.id);
        let completedCoursesCount = 0;
        if (enrolledCourseIds.length > 0) {
            const progressQuery = `
                SELECT
                    c.id as course_id,
                    -- Total lessons for the latest resource
                    (
                        SELECT COUNT(*) FROM chapters ch 
                        WHERE ch.resource_id = (SELECT r.id FROM resources r WHERE r.course_id = c.id ORDER BY r.created_at DESC LIMIT 1)
                    ) as total_lessons,
                    -- Completed lessons (manual + quiz) for the latest resource
                    (
                        SELECT COUNT(DISTINCT completed.chapter_id) FROM (
                            SELECT ucp.chapter_id FROM user_chapter_progress ucp JOIN chapters ch ON ucp.chapter_id = ch.id WHERE ucp.learner_id = $1 AND ch.resource_id = (SELECT r.id FROM resources r WHERE r.course_id = c.id ORDER BY r.created_at DESC LIMIT 1)
                            UNION
                            SELECT q.chapter_id FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.learner_id = $1 AND q.resource_id = (SELECT r.id FROM resources r WHERE r.course_id = c.id ORDER BY r.created_at DESC LIMIT 1) AND qa.passed = TRUE AND q.chapter_id IS NOT NULL
                        ) as completed
                    ) as completed_lessons
                FROM courses c
                WHERE c.id = ANY($2::int[]); -- Check only the courses the user is enrolled in
            `;
            const progressResult = yield db_1.default.query(progressQuery, [learnerId, enrolledCourseIds]);
            progressResult.rows.forEach(row => {
                if (row.total_lessons > 0 && row.total_lessons === row.completed_lessons) {
                    completedCoursesCount++;
                }
            });
        }
        const isEligible = completedCoursesCount > 0;
        const programsQuery = `
            SELECT *, EXISTS(SELECT 1 FROM physical_enrollments WHERE program_id = pp.id AND learner_id = $1) as "isEnrolled"
            FROM physical_programs pp ORDER BY pp.id;
        `;
        const programsResult = yield db_1.default.query(programsQuery, [learnerId]);
        return {
            programs: programsResult.rows,
            isEligible: isEligible
        };
    }),
    enrollInPhysicalProgram: (learnerId, programId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            INSERT INTO physical_enrollments (learner_id, program_id) VALUES ($1, $2)
            ON CONFLICT (learner_id, program_id) DO NOTHING
            RETURNING *;
        `;
        const { rows } = yield db_1.default.query(query, [learnerId, programId]);
        if (rows.length === 0)
            throw new Error("Already enrolled or program not found.");
        return rows[0];
    }),
    getPublicPhysicalPrograms: () => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT 
                id, title, description, duration, schedule, next_session, location, 
                image_url, skills, requirements
            FROM physical_programs 
            ORDER BY id;
        `;
        const { rows } = yield db_1.default.query(query);
        return rows;
    }),
};
