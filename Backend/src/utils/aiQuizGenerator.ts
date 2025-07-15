import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: string;
}

export async function generateQuiz(
    title: string, 
    content: string, 
    numQuestions: number, 
    quizType: 'chapter' | 'final'
): Promise<QuizQuestion[] | null> {
    
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

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const rawResponseText = response.text();

        const cleanedJsonString = rawResponseText.replace(/```json|```/g, '').trim();

        const quizData: QuizQuestion[] = JSON.parse(cleanedJsonString);
        
        if (Array.isArray(quizData) && quizData.length > 0) {
            return quizData;
        } else {
            console.error("AI returned a valid JSON but it was not a non-empty array.");
            return null;
        }

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("AI Quiz Generator: JSON Parse Error.", error.message);
        } else {
            console.error("AI Quiz Generator: Error generating quiz questions.", error);
        }
        return null;
    }
}