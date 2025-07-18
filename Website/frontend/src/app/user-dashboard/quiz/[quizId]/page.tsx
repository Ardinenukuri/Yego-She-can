'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import '@/styles/quiz.css'; 


interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

interface Quiz {
    quiz_id: number;
    questions: QuizQuestion[];
    is_final: boolean; 
}


export default function TakeQuizPage() {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const params = useParams();
    const router = useRouter();
    const quizId = params.quizId as string;

    // --- 2. CORRECTED DATA FETCHING ---
    useEffect(() => {
        if (!quizId) {
            setLoading(false);
            return;
        }

        const fetchQuiz = async () => {
            try {
                const response = await api.get(`/api/quizzes/${quizId}`);
                setQuiz(response.data.quiz);
            } catch (error) {
                console.error("Failed to load quiz:", error);
                toast.error("Could not load quiz. You may not have access to it.");

            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);


    const handleSubmit = async () => {

        if (Object.keys(userAnswers).length !== quiz?.questions.length) {
            toast.error("Please answer all questions before submitting.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Submitting answers...");

        try {
            const response = await api.post(`/api/quizzes/${quizId}/submit`, { answers: userAnswers });
            const result = response.data.result;

            if (result.passed) {
                toast.success(`Quiz passed with ${result.score_percentage}%!`, { id: toastId, duration: 4000 });
            } else {
                toast.error(`Quiz failed with ${result.score_percentage}%. The passing score is 80%.`, { id: toastId, duration: 6000 });
            }
            

            setTimeout(() => {
                router.back();
            }, 2000);

        } catch (error) {
            toast.error("Failed to submit quiz.", { id: toastId });
            setIsSubmitting(false); 
        }
    };


    if (loading) {
        return <div className="quiz-page"><h1>Loading Quiz...</h1></div>;
    }

    if (!quiz) {
        return (
            <div className="quiz-page">
                <h1>Quiz Not Found</h1>
                <p>This quiz could not be loaded. It might be invalid, or you may not have permission to access it.</p>
                <button onClick={() => router.back()} className="submit-quiz-button" style={{ marginTop: '2rem' }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            <h1 className="quiz-title">{quiz.is_final ? "Final Quiz" : "Chapter Quiz"}</h1>
            <div className="quiz-questions">
                {quiz.questions.map((q, index) => (
                    <div key={index} className="quiz-question-card">
                        <p className="question-text">{index + 1}. {q.question}</p>
                        <div className="options-group">
                            {q.options.map(option => (
                                <label key={option} className={`option-label ${userAnswers[q.question] === option ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name={q.question}
                                        value={option}
                                        checked={userAnswers[q.question] === option}
                                        onChange={(e) => setUserAnswers({...userAnswers, [q.question]: e.target.value})}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit} className="submit-quiz-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
        </div>
    );
}