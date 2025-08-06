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
exports.QuizService = void 0;
const db_1 = __importDefault(require("../config/db"));
const aiQuizGenerator_1 = require("../utils/aiQuizGenerator");
exports.QuizService = {
    createChapterQuiz: (mentorId, courseId, chapterId) => __awaiter(void 0, void 0, void 0, function* () {
        const validationQuery = `
            SELECT 
                ch.title, 
                ch.content,
                ch.resource_id
            FROM chapters ch
            JOIN resources r ON ch.resource_id = r.id
            JOIN course_mentors cm ON r.course_id = cm.course_id
            WHERE ch.id = $1 AND r.course_id = $2 AND cm.mentor_id = $3;
        `;
        const validationResult = yield db_1.default.query(validationQuery, [chapterId, courseId, mentorId]);
        if (validationResult.rowCount === 0) {
            throw new Error('Chapter not found for this course, or you are not authorized as a mentor for it.');
        }
        const { title, content, resource_id: resourceId } = validationResult.rows[0];
        const questions = yield (0, aiQuizGenerator_1.generateQuiz)(title, content, 5, 'chapter');
        if (!questions) {
            throw new Error('Failed to generate quiz questions from AI. The service may be temporarily unavailable.');
        }
        const quizQuery = `
            INSERT INTO quizzes (resource_id, chapter_id, questions, is_final)
            VALUES ($1, $2, $3, FALSE)
            ON CONFLICT (chapter_id) DO UPDATE SET
                questions = EXCLUDED.questions,
                updated_at = NOW()
            RETURNING id, questions
        `;
        const { rows } = yield db_1.default.query(quizQuery, [resourceId, chapterId, JSON.stringify(questions)]);
        return rows[0];
    }),
    createFinalQuiz: (mentorId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const authCheck = yield db_1.default.query('SELECT * FROM course_mentors WHERE mentor_id = $1 AND course_id = $2', [mentorId, courseId]);
        if (authCheck.rowCount === 0)
            throw new Error('Forbidden: You are not a mentor for this course.');
        const resourceCheck = yield db_1.default.query(`SELECT r.id as resource_id, c.name as course_name 
             FROM resources r 
             JOIN courses c ON r.course_id = c.id
             WHERE r.course_id = $1 
             ORDER BY r.created_at DESC LIMIT 1`, [courseId]);
        if (resourceCheck.rowCount === 0)
            throw new Error('No resources found for this course to generate a quiz from.');
        const { resource_id: resourceId, course_name: courseName } = resourceCheck.rows[0];
        const chaptersRes = yield db_1.default.query('SELECT title, content FROM chapters WHERE resource_id = $1 ORDER BY chapter_number', [resourceId]);
        if (chaptersRes.rowCount === 0)
            throw new Error('This course has no chapters to create a quiz from.');
        const fullContent = chaptersRes.rows.map(ch => `Chapter: ${ch.title}\n${ch.content}`).join('\n\n---\n\n');
        const questions = yield (0, aiQuizGenerator_1.generateQuiz)(courseName, fullContent, 10, 'final');
        if (!questions)
            throw new Error('Failed to generate final quiz questions from AI.');
        const quizQuery = `
            INSERT INTO quizzes (resource_id, questions, is_final)
            VALUES ($1, $2, TRUE)
            ON CONFLICT (resource_id) WHERE is_final = true DO UPDATE SET
                questions = EXCLUDED.questions,
                updated_at = NOW()
            RETURNING id, questions
        `;
        const { rows } = yield db_1.default.query(quizQuery, [resourceId, JSON.stringify(questions)]);
        return rows[0];
    }),
    getQuizForLearner: (learnerId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
        const authQuery = `
            SELECT q.id as quiz_id, q.questions, q.is_final
            FROM quizzes q
            JOIN resources r ON q.resource_id = r.id
            JOIN enrollments e ON r.course_id = e.course_id
            WHERE q.id = $1 AND e.learner_id = $2
        `;
        const authResult = yield db_1.default.query(authQuery, [quizId, learnerId]);
        if (authResult.rowCount === 0) {
            throw new Error('Forbidden: You are not enrolled in the course for this quiz.');
        }
        const quiz = authResult.rows[0];
        const attemptQuery = `
            SELECT score_percentage, answers, feedback, passed, retry_after
            FROM quiz_attempts
            WHERE learner_id = $1 AND quiz_id = $2
            ORDER BY attempted_at DESC
            LIMIT 1
        `;
        const attemptResult = yield db_1.default.query(attemptQuery, [learnerId, quizId]);
        const previousAttempt = attemptResult.rows[0] || null;
        if (previousAttempt && !previousAttempt.passed && previousAttempt.retry_after && new Date() < new Date(previousAttempt.retry_after)) {
            throw new Error(`Quiz failed! You can try again after ${new Date(previousAttempt.retry_after).toLocaleString()}.`);
        }
        return { quiz, previousAttempt };
    }),
    submitQuiz: (learnerId, quizId, submittedAnswers) => __awaiter(void 0, void 0, void 0, function* () {
        const quizRes = yield db_1.default.query('SELECT questions, is_final FROM quizzes WHERE id = $1', [quizId]);
        if (quizRes.rowCount === 0)
            throw new Error('Quiz not found.');
        const quiz = quizRes.rows[0];
        const correctQuestions = quiz.questions;
        let correctAnswersCount = 0;
        const feedback = {};
        correctQuestions.forEach(q => {
            const userAnswer = submittedAnswers[q.question];
            const isCorrect = userAnswer === q.correct_answer;
            if (isCorrect) {
                correctAnswersCount++;
            }
            feedback[q.question] = {
                selected: userAnswer || "Not Answered",
                correct: q.correct_answer,
                is_correct: isCorrect,
            };
        });
        const scorePercentage = (correctAnswersCount / correctQuestions.length) * 100;
        const requiredScore = quiz.is_final ? 80.0 : 80.0;
        const passed = scorePercentage >= requiredScore;
        const retryAfter = !passed ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null; // 24 hours from now
        const attemptQuery = `
            INSERT INTO quiz_attempts (learner_id, quiz_id, score_percentage, answers, feedback, passed, retry_after)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, score_percentage, passed, feedback
        `;
        const { rows } = yield db_1.default.query(attemptQuery, [
            learnerId,
            quizId,
            scorePercentage.toFixed(2),
            JSON.stringify(submittedAnswers),
            JSON.stringify(feedback),
            passed,
            retryAfter
        ]);
        return rows[0];
    }),
    getQuizOverviewForMentor: (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT
                q.id as "quizId",
                CASE
                    WHEN q.is_final THEN c.name || ' - Final Quiz'
                    ELSE ch.title
                END as title,
                c.name as course,
                (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id)::int as "expectedStudents",
                COALESCE(attempt_stats."totalStudents", 0)::int as "totalStudents",
                COALESCE(attempt_stats.passed, 0)::int as passed,
                COALESCE(attempt_stats.failed, 0)::int as failed
            FROM 
                course_mentors cm
            -- Start from the mentor's assignments to guarantee authorization
            JOIN courses c ON cm.course_id = c.id
            JOIN resources r ON c.id = r.course_id
            JOIN quizzes q ON r.id = q.resource_id
            LEFT JOIN chapters ch ON q.chapter_id = ch.id
            LEFT JOIN (
                SELECT quiz_id, COUNT(DISTINCT learner_id) as "totalStudents", SUM(CASE WHEN passed THEN 1 ELSE 0 END) as passed, SUM(CASE WHEN NOT passed THEN 1 ELSE 0 END) as failed
                FROM quiz_attempts GROUP BY quiz_id
            ) AS attempt_stats ON q.id = attempt_stats.quiz_id
            WHERE cm.mentor_id = $1
            -- We add this to only show quizzes from the LATEST resource of each course
            AND r.id = (
                SELECT id FROM resources 
                WHERE course_id = c.id 
                ORDER BY created_at DESC 
                LIMIT 1
            )
            ORDER BY c.name, q.is_final, ch.id;
        `;
        const { rows } = yield db_1.default.query(query, [mentorId]);
        return rows;
    }),
};
