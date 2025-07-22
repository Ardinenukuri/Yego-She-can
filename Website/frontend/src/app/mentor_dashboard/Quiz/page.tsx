'use client'
import { useEffect, useState } from 'react'
import './allQuiz.css'
import { Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type Quiz = {
  title: string
  chapter: string
  totalStudents: number
  passed: number
  failed: number
  expectedStudents: number
}

export default function AllQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const pathname = usePathname()
  const [showCourseForm, setShowCourseForm] = useState(false)
  
  // Define isActive as a function
  const isActive = (path: string) => {
    return pathname === path
  }

  useEffect(() => {
    const saved = localStorage.getItem('quizzes_overview')
    if (saved) {
      setQuizzes(JSON.parse(saved))
    } else {
      setQuizzes([
        {
          title: 'Quiz 1: Soil Fertility',
          chapter: 'Chapter 2: Soil Science',
          totalStudents: 10,
          passed: 7,
          failed: 3,
          expectedStudents: 15,
        },
        {
          title: 'Quiz 2: Crop Management',
          chapter: 'Chapter 3: Agronomy Basics',
          totalStudents: 8,
          passed: 6,
          failed: 2,
          expectedStudents: 12,
        },
      ])
    }
  }, [])

  return (
    <div className="quizzes-page-admin">
      <div className="admin-header">
        <h1>Quiz Overview</h1>
        
        <Link href="/mentor_dashboard/createQiuz" className="add-quiz-button">
          <Plus className="icon-sm" />
          Add a Quiz
        </Link>
      </div>

      <table className="courses-table">
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Chapter</th>
            <th>Expected</th>
            <th>Attempted</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Missed</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => {
            const missed = quiz.expectedStudents - quiz.totalStudents
            return (
              <tr key={index}>
                <td>{quiz.title}</td>
                <td>{quiz.chapter}</td>
                <td>{quiz.expectedStudents}</td>
                <td>{quiz.totalStudents}</td>
                <td className="passed">{quiz.passed}</td>
                <td className="failed">{quiz.failed}</td>
                <td className="missed">{missed}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}