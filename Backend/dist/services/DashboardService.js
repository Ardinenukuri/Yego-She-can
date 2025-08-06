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
exports.DashboardService = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.DashboardService = {
    getDashboardData: () => __awaiter(void 0, void 0, void 0, function* () {
        const [courseData, mentorData, studentData, kpiData] = yield Promise.all([
            db_1.default.query(`
                SELECT 
                    c.id, c.name as title, m.id as "mentorId",
                    CASE WHEN m.id IS NOT NULL THEN m.first_name || ' ' || m.last_name ELSE '' END as "mentorName",
                    CASE WHEN m.status = 'pending' THEN 'pending' WHEN m.id IS NOT NULL THEN 'assigned' ELSE 'not-assigned' END as "mentorStatus"
                FROM courses c
                LEFT JOIN course_mentors cm ON c.id = cm.course_id
                LEFT JOIN users m ON cm.mentor_id = m.id AND m.role = 'mentor';
            `),
            db_1.default.query(`
                SELECT 
                    u.id, u.first_name || ' ' || u.last_name as name, u.status,
                    COUNT(cm.course_id)::int as "assignedCourses"
                FROM users u
                LEFT JOIN course_mentors cm ON u.id = cm.mentor_id
                WHERE u.role = 'mentor'
                GROUP BY u.id, u.first_name, u.last_name, u.status;
            `),
            db_1.default.query(`
                SELECT
                    u.id,
                    u.first_name || ' ' || u.last_name as name,
                    c.name as "enrolledCourse",
                    m.first_name || ' ' || m.last_name as mentor,
                    -- Use COALESCE to default progress to 0 if calculations result in NULL
                    COALESCE(progress_calculation.progress, 0)::int as progress
                FROM 
                    users u
                JOIN 
                    enrollments e ON u.id = e.learner_id
                JOIN 
                    courses c ON e.course_id = c.id
                LEFT JOIN 
                    course_mentors cm ON c.id = cm.course_id
                LEFT JOIN 
                    users m ON cm.mentor_id = m.id
                -- This LATERAL join calculates progress for each student row (u, e)
                LEFT JOIN LATERAL (
                    SELECT 
                        ROUND(
                            (COUNT(DISTINCT completed.chapter_id) * 100.0) / 
                            NULLIF(total_chapters.count, 0)
                        ) as progress
                    FROM
                        (SELECT id FROM resources WHERE course_id = e.course_id ORDER BY created_at DESC LIMIT 1) as latest_resource,
                        LATERAL (SELECT COUNT(*) as count FROM chapters WHERE resource_id = latest_resource.id) as total_chapters,
                        LATERAL (
                            SELECT ucp.chapter_id FROM user_chapter_progress ucp WHERE ucp.learner_id = u.id AND ucp.chapter_id IN (SELECT id FROM chapters WHERE resource_id = latest_resource.id)
                            UNION
                            SELECT q.chapter_id FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.learner_id = u.id AND q.resource_id = latest_resource.id AND qa.passed = TRUE AND q.chapter_id IS NOT NULL
                        ) as completed
                    GROUP BY total_chapters.count
                ) as progress_calculation ON true
                WHERE u.role = 'learner';
            `),
            db_1.default.query(`
                SELECT
                    (SELECT COUNT(*) FROM courses) as "totalCourses",
                    (SELECT COUNT(*) FROM users WHERE role = 'mentor' AND status = 'active') as "activeMentors",
                    (SELECT COUNT(*) FROM enrollments) as "enrolledStudents";
            `)
        ]);
        const processedMentors = mentorData.rows.map(m => (Object.assign(Object.assign({}, m), { status: m.status === 'disabled' ? 'Inactive' : m.status === 'active' ? 'Active' : 'pending' })));
        const processedStudents = studentData.rows;
        return {
            kpis: kpiData.rows[0],
            courses: courseData.rows,
            mentors: processedMentors,
            students: processedStudents
        };
    })
};
