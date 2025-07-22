'use client'

type Props = {
  questions: string[]
}

export default function QuizPreview({ questions }: Props) {
  return (
    <div className="quiz-preview">
      <h2>Generated Questions</h2>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{q}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
