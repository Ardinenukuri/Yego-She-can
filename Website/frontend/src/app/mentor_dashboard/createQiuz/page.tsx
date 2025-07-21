'use client'

import { useState, useEffect } from 'react'
import './createQuiz.css'

// Sample modules with lessons data (for demonstration)
const modules = [
  {
    id: 'mod1',
    name: 'Module 1: Introduction',
    lessons: [
      { id: 'l1', title: 'Lesson 1: Basics' },
      { id: 'l2', title: 'Lesson 2: Overview' },
    ],
  },
  {
    id: 'mod2',
    name: 'Module 2: Advanced Topics',
    lessons: [
      { id: 'l3', title: 'Lesson 1: Deep Dive' },
      { id: 'l4', title: 'Lesson 2: Case Studies' },
    ],
  },
]

export default function CreateQuizPage() {
  // Module and lesson selectors
  const [selectedModule, setSelectedModule] = useState<string>('')  
  const [selectedLesson, setSelectedLesson] = useState<string>('') 

  // Quiz questions data
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '' },
  ])

  // Load previous quiz from localStorage
  useEffect(() => {
    const savedQuiz = localStorage.getItem('quiz')
    if (savedQuiz) {
      const parsed = JSON.parse(savedQuiz)
      // Expecting an object with { module, lesson, questions }
      if (parsed.questions) {
        setQuestions(parsed.questions)
      }
      if (parsed.module) {
        setSelectedModule(parsed.module)
      }
      if (parsed.lesson) {
        setSelectedLesson(parsed.lesson)
      }
    }
  }, [])

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modId = e.target.value
    setSelectedModule(modId)
    setSelectedLesson('')  // Reset lesson on module change
  }

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLesson(e.target.value)
  }

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions]
    updated[index].question = value
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const handleAnswerChange = (qIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].answer = value
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answer: '' },
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModule) {
      return alert('Please select a module.')
    }
    // You can optionally require lesson selection here if needed
    const quizData = {
      module: selectedModule,
      lesson: selectedLesson, // May be empty string (optional)
      questions,
    }
    localStorage.setItem('quiz', JSON.stringify(quizData))
    alert('✅ Quiz saved to localStorage!')
  }

  // Get current module's lessons if one is selected
  const currentModule = modules.find((mod) => mod.id === selectedModule)
  const lessons = currentModule ? currentModule.lessons : []

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Create a Quiz</h1>

      {/* Module Selector */}
      <div className="selector-group">
        <label className="selector-label">Select a Module:</label>
        <select
          value={selectedModule}
          onChange={handleModuleChange}
          className="selector-input"
          required
        >
          <option value="">-- Choose a module --</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lesson Selector (optional) */}
      {selectedModule && (
        <div className="selector-group">
          <label className="selector-label">Select a Lesson (optional):</label>
          <select
            value={selectedLesson}
            onChange={handleLessonChange}
            className="selector-input"
          >
            <option value="">-- No lesson selected --</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quiz Questions Form */}
      <form onSubmit={handleSubmit} className="quiz-form">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <label>Question {qIndex + 1}</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              placeholder="Enter the question"
              required
            />

            <div className="options">
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  placeholder={`Option ${oIndex + 1}`}
                  required
                />
              ))}
            </div>

            <select
              value={q.answer}
              onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
              required
            >
              <option value="">Select the correct answer</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="add-btn">
           Add Another Question
        </button>

        <button type="submit" className="submit-btn">
           Save Quiz
        </button>
      </form>
    </div>
  )
}
