'use client'

import './addQuiz.css'
import AddQuizForm from './AddQuizForm/page'

export default function AddQuizPage() {
  return (
    <div className="add-quiz-container">
      <h1 className="page-title">Create a New Quiz</h1>
      <AddQuizForm/>
    </div>
  )
}
