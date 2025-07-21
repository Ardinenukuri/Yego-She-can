'use client'

import { useState } from 'react'
import QuizPreview from '../QuizPreview/page'

const mockCourses = [
  { id: 'course1', title: 'Agribusiness Basics', chapters: ['Intro', 'Market Systems', 'Value Chain'] },
  { id: 'course2', title: 'Sustainable Farming', chapters: ['Soil', 'Irrigation', 'Pest Control'] },
]

export default function AddQuizForm() {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [quizScope, setQuizScope] = useState<'chapter' | 'overall' | ''>('')
  const [questions, setQuestions] = useState<string[]>([])
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([])

  const handleGenerateQuiz = () => {
    const generated = quizScope === 'overall'
      ? Array.from({ length: 10 }, (_, i) => `Overall question ${i + 1} for "${selectedCourse}"`)
      : Array.from({ length: 5 }, (_, i) => `Question ${i + 1} from chapter "${selectedChapter}"`)
    setQuestions(generated)
  }

  const handleSaveQuiz = () => {
    if (!selectedCourse || !quizScope || questions.length === 0) {
      alert('Please generate questions first.')
      return
    }

    const newQuiz = {
      course: selectedCourse,
      scope: quizScope,
      chapter: quizScope === 'chapter' ? selectedChapter : null,
      questions,
    }

    setSavedQuizzes(prev => [...prev, newQuiz])
    alert('Quiz saved successfully!')
    // You can later replace this with backend API call
    console.log('Saved quiz:', newQuiz)
  }

  const currentChapters = mockCourses.find(c => c.title === selectedCourse)?.chapters || []

  return (
    <div className="quiz-card">
      <h2 className="form-header">Quiz Setup</h2>

      <div className="form-group">
        <label>Choose a Course:</label>
        <select value={selectedCourse} onChange={e => {
          setSelectedCourse(e.target.value)
          setSelectedChapter('')
          setQuizScope('')
          setQuestions([])
        }}>
          <option value="">-- Select Course --</option>
          {mockCourses.map(course => (
            <option key={course.id} value={course.title}>{course.title}</option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="form-group">
          <label>Quiz Scope:</label>
          <select value={quizScope} onChange={e => {
            setQuizScope(e.target.value as 'chapter' | 'overall')
            setSelectedChapter('')
            setQuestions([])
          }}>
            <option value="">-- Select Scope --</option>
            <option value="chapter">Chapter-based</option>
            <option value="overall">Overall Course</option>
          </select>
        </div>
      )}

      {quizScope === 'chapter' && (
        <div className="form-group">
          <label>Select Chapter:</label>
          <select value={selectedChapter} onChange={e => {
            setSelectedChapter(e.target.value)
            setQuestions([])
          }}>
            <option value="">-- Select Chapter --</option>
            {currentChapters.map((ch, i) => (
              <option key={i} value={ch}>{ch}</option>
            ))}
          </select>
        </div>
      )}

      {quizScope && (quizScope === 'overall' || selectedChapter) && (
        <button className="generate-btn" onClick={handleGenerateQuiz}>
          Generate Questions
        </button>
      )}

      {questions.length > 0 && (
        <>
          <QuizPreview questions={questions} />
          <button className="save-btn" onClick={handleSaveQuiz}>
            Save Quiz
          </button>
        </>
      )}
    </div>
  )
}
