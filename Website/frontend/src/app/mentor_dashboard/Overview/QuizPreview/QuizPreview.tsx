'use client'

// Define the type for a single AI-generated question
interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

// Define the props for this component
interface QuizPreviewProps {
  questions: QuizQuestion[] | undefined;
}

// This is now a standard, reusable component, not a page.
export default function QuizPreview({ questions }: QuizPreviewProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-preview">
        <h2 className="preview-title">Generated Quiz Preview</h2>
        <p className="preview-subtitle">No questions have been generated yet.</p>
      </div>
    );
  }

  return (
    <div className="quiz-preview">
      <h2 className="preview-title">Generated Quiz Preview</h2>
      <p className="preview-subtitle">Review the questions below. If they look good, they are already saved.</p>
      
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={index} className="preview-question-card">
            <p className="preview-question-text"><strong>{index + 1}.</strong> {q.question}</p>
            <ul className="preview-options-list">
              {q.options?.map((option, optIndex) => (
                <li 
                  key={optIndex} 
                  className={option === q.correct_answer ? 'correct-answer' : ''}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}