'use client'

// Define the type for a single AI-generated question
interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

type Props = {
  questions: QuizQuestion[]
}

export default function QuizPreview({ questions }: Props) {
  return (
    <div className="quiz-preview">
      <h2 className="preview-title">Generated Quiz Preview</h2>
      <p className="preview-subtitle">Review the questions below. If they look good, they are already saved.</p>
      
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={index} className="preview-question-card">
            <p className="preview-question-text"><strong>{index + 1}.</strong> {q.question}</p>
            <ul className="preview-options-list">
              {q.options.map((option, optIndex) => (
                <li 
                  key={optIndex} 
                  // Add a 'correct' class to highlight the right answer
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