'use client'

// Define the type for a single AI-generated question
interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

type Props = {
  // The 'questions' prop could be undefined when the parent is still loading
  questions: QuizQuestion[] | undefined;
}

export default function QuizPreview({ questions }: Props) {
  // ==================================================================
  //                        *** THE FIX ***
  // Add a check here. If questions is undefined, null, or an empty array,
  // return a message instead of trying to map over it.
  // ==================================================================
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-preview">
        <h2 className="preview-title">Generated Quiz Preview</h2>
        <p className="preview-subtitle">No questions have been generated yet.</p>
      </div>
    );
  }

  // If the code reaches this point, we know 'questions' is a valid array.
  return (
    <div className="quiz-preview">
      <h2 className="preview-title">Generated Quiz Preview</h2>
      <p className="preview-subtitle">Review the questions below. If they look good, they are already saved.</p>
      
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={index} className="preview-question-card">
            <p className="preview-question-text"><strong>{index + 1}.</strong> {q.question}</p>
            <ul className="preview-options-list">
              {/* Also a good idea to add optional chaining here just in case an option list could be empty */}
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