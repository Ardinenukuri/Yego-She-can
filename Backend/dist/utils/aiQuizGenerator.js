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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuiz = generateQuiz;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function generateQuiz(title_1, content_1, numQuestions_1, quizType_1) {
    return __awaiter(this, arguments, void 0, function* (title, content, numQuestions, quizType, retries = 3) {
        const quizDescription = (quizType === 'chapter')
            ? "Each question should be based on a different key concept from the chapter content provided."
            : "The quiz should broadly cover all the provided content, testing the most important key concepts from the entire course.";
        const prompt = `
        You are an expert instructional designer tasked with creating an engaging quiz.
        Generate exactly ${numQuestions} multiple-choice quiz questions based on the following content for a ${quizType} quiz.

        **Title:** "${title}"
        **Content:**
        ---
        ${content}
        ---

        **Instructions:**
        1. ${quizDescription}
        2. Ensure the "correct_answer" is always one of the values present in the "options" array.
        3. The "options" array should contain exactly 4 distinct string values.

        Return the quiz in a valid JSON array format, with no markdown formatting like \`\`\`json or \`\`\`.
        The format must be an array of objects, like this:
        [
            {
                "question": "What is the primary benefit of budgeting?",
                "options": ["Increased income", "Tracking expenses", "Eliminating debt", "Getting rich quick"],
                "correct_answer": "Tracking expenses"
            }
        ]
    `;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const result = yield model.generateContent(prompt);
                const response = result.response;
                const rawResponseText = response.text();
                const cleanedJsonString = rawResponseText.replace(/```json|```/g, '').trim();
                const quizData = JSON.parse(cleanedJsonString);
                if (Array.isArray(quizData) && quizData.length > 0) {
                    return quizData;
                }
                else {
                    console.error("AI returned a valid JSON but it was not a non-empty array.");
                    return null;
                }
            }
            catch (error) {
                if (error.message && error.message.includes('503') && attempt < retries) {
                    console.warn(`AI Quiz Generator: Model overloaded (Attempt ${attempt}/${retries}). Retrying in ${attempt * 2} seconds...`);
                    yield sleep(attempt * 2000);
                    continue;
                }
                if (error instanceof SyntaxError) {
                    console.error("AI Quiz Generator: JSON Parse Error after all retries.", error.message);
                }
                else {
                    console.error(`AI Quiz Generator: Failed to generate quiz questions after ${attempt} attempts.`, error);
                }
                return null;
            }
        }
        console.error(`AI Quiz Generator: All ${retries} attempts failed.`);
        return null;
    });
}
