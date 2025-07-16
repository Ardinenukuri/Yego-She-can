// src/services/QuizService.ts
import pool from '../config/db';
import { generateQuiz, QuizQuestion } from '../utils/aiQuizGenerator';

export const QuizService = {

    /**
     * Generates and saves a quiz for a specific chapter.
     */
    createChapterQuiz: async (mentorId: number, courseId: number, chapterId: number) => {
        // 1. Authorize: Ensure mentor is assigned to the course.
        const authCheck = await pool.query(
            'SELECT r.id as resource_id FROM course_mentors cm JOIN resources r ON cm.course_id = r.course_id WHERE cm.mentor_id = $1 AND cm.course_id = $2',
            [mentorId, courseId]
        );
        if (authCheck.rowCount === 0) throw new Error('Forbidden: You are not a mentor for this course.');
        const resourceId = authCheck.rows[0].resource_id;

        // 2. Fetch chapter content.
        const chapterRes = await pool.query('SELECT title, content FROM chapters WHERE id = $1 AND resource_id = $2', [chapterId, resourceId]);
        if (chapterRes.rowCount === 0) throw new Error('Chapter not found for this course.');
        const chapter = chapterRes.rows[0];

        // 3. Generate quiz using AI.
        const questions = await generateQuiz(chapter.title, chapter.content, 5, 'chapter');
        if (!questions) throw new Error('Failed to generate quiz questions from AI.');

        // 4. Save to DB (Upsert: update if exists, insert if not).
        const quizQuery = `
            INSERT INTO quizzes (resource_id, chapter_id, questions, is_final)
            VALUES ($1, $2, $3, FALSE)
            ON CONFLICT (chapter_id) DO UPDATE SET
                questions = EXCLUDED.questions,
                updated_at = NOW()
            RETURNING id, questions
        `;
        const { rows } = await pool.query(quizQuery, [resourceId, chapterId, JSON.stringify(questions)]);
        return rows[0];
    },

    /**
     * Generates and saves a final quiz for a course.
     */
    createFinalQuiz: async (mentorId: number, courseId: number) => {
        // 1. Authorize mentor and get course/resource info.
        const authCheck = await pool.query(
            `SELECT r.id as resource_id, c.name as course_name 
             FROM course_mentors cm 
             JOIN courses c ON cm.course_id = c.id
             JOIN resources r ON cm.course_id = r.course_id 
             WHERE cm.mentor_id = $1 AND cm.course_id = $2`,
            [mentorId, courseId]
        );
        if (authCheck.rowCount === 0) throw new Error('Forbidden: You are not a mentor for this course.');
        const { resource_id: resourceId, course_name: courseName } = authCheck.rows[0];

        // 2. Fetch and concatenate all chapter content for the course's resource.
        const chaptersRes = await pool.query('SELECT title, content FROM chapters WHERE resource_id = $1 ORDER BY chapter_number', [resourceId]);
        if (chaptersRes.rowCount === 0) throw new Error('This course has no chapters to create a quiz from.');
        const fullContent = chaptersRes.rows.map(ch => `Chapter: ${ch.title}\n${ch.content}`).join('\n\n---\n\n');

        // 3. Generate final quiz using AI.
        const questions = await generateQuiz(courseName, fullContent, 10, 'final');
        if (!questions) throw new Error('Failed to generate final quiz questions from AI.');

        // 4. Save to DB (Upsert).
        const quizQuery = `
            INSERT INTO quizzes (resource_id, questions, is_final)
            VALUES ($1, $2, TRUE)
            ON CONFLICT (resource_id) WHERE is_final = true DO UPDATE SET
                questions = EXCLUDED.questions,
                updated_at = NOW()
            RETURNING id, questions
        `;
        const { rows } = await pool.query(quizQuery, [resourceId, JSON.stringify(questions)]);
        return rows[0];
    },

    getQuizForLearner: async (learnerId: number, quizId: number) => {
        // 1. Authorize: Ensure the learner is enrolled in the course this quiz belongs to.
        const authQuery = `
            SELECT q.id as quiz_id, q.questions, q.is_final
            FROM quizzes q
            JOIN resources r ON q.resource_id = r.id
            JOIN enrollments e ON r.course_id = e.course_id
            WHERE q.id = $1 AND e.learner_id = $2
        `;
        const authResult = await pool.query(authQuery, [quizId, learnerId]);
        if (authResult.rowCount === 0) {
            throw new Error('Forbidden: You are not enrolled in the course for this quiz.');
        }
        const quiz = authResult.rows[0];

        // 2. Fetch the most recent attempt for this quiz by this learner.
        const attemptQuery = `
            SELECT score_percentage, answers, feedback, passed, retry_after
            FROM quiz_attempts
            WHERE learner_id = $1 AND quiz_id = $2
            ORDER BY attempted_at DESC
            LIMIT 1
        `;
        const attemptResult = await pool.query(attemptQuery, [learnerId, quizId]);
        const previousAttempt = attemptResult.rows[0] || null;

        // 3. Prevent retaking a failed quiz before the cooldown period.
        if (previousAttempt && !previousAttempt.passed && previousAttempt.retry_after && new Date() < new Date(previousAttempt.retry_after)) {
            throw new Error(`Quiz failed! You can try again after ${new Date(previousAttempt.retry_after).toLocaleString()}.`);
        }
        
        // Return the quiz questions and any previous attempt.
        return { quiz, previousAttempt };
    },

    /**
     * [Learner] Submits answers for a quiz, scores it, and records the attempt.
     */
    submitQuiz: async (learnerId: number, quizId: number, submittedAnswers: Record<string, string>) => {
        // 1. Get the quiz with correct answers from the database.
        const quizRes = await pool.query('SELECT questions, is_final FROM quizzes WHERE id = $1', [quizId]);
        if (quizRes.rowCount === 0) throw new Error('Quiz not found.');
        
        const quiz = quizRes.rows[0];
        const correctQuestions: QuizQuestion[] = quiz.questions;

        // 2. Score the quiz and generate feedback.
        let correctAnswersCount = 0;
        const feedback: Record<string, object> = {};
        
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
        
        // 3. Determine pass/fail status.
        const requiredScore = quiz.is_final ? 80.0 : 80.0; // e.g., 80% to pass (4/5 or 8/10)
        const passed = scorePercentage >= requiredScore;
        
        // 4. Set retry timestamp if failed.
        const retryAfter = !passed ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null; // 48 hours from now

        // 5. Save the attempt to the database.
        const attemptQuery = `
            INSERT INTO quiz_attempts (learner_id, quiz_id, score_percentage, answers, feedback, passed, retry_after)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, score_percentage, passed, feedback
        `;
        const { rows } = await pool.query(attemptQuery, [
            learnerId,
            quizId,
            scorePercentage.toFixed(2),
            JSON.stringify(submittedAnswers),
            JSON.stringify(feedback),
            passed,
            retryAfter
        ]);

        return rows[0];
    }
};