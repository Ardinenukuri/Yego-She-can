'use client'

import { useState } from 'react'
import Modal from 'react-modal'
import toast, { Toaster } from 'react-hot-toast'
import '@/styles/courses.css'

type Chapter = {
  id: string
  title: string
  content: string
  hasQuiz?: boolean
}

const dummyCourse = {
  title: 'Empowering Women Entrepreneurs',
  description: 'Learn the essential skills and mindset to start and grow your own business.',
  chapters: [
    {
      id: 'chapter1',
      title: 'Chapter 1: Introduction to Entrepreneurship',
      content:
        'Learn the basics of entrepreneurship, including what it means to be an entrepreneur and the mindset required to succeed.',
      hasQuiz: true,
    },
    {
      id: 'chapter2',
      title: 'Chapter 2: Identifying Business Opportunities',
      content: 'Discover how to spot profitable business ideas and evaluate market needs.',
      hasQuiz: true,
    },
    {
      id: 'chapter3',
      title: 'Chapter 3: Business Planning Basics',
      content: 'Understand the key components of a business plan and how to create one.',
      hasQuiz: true,
    },
    {
      id: 'chapter4',
      title: 'Chapter 4: Marketing and Branding',
      content: 'Learn effective strategies to promote your business and build a brand.',
      hasQuiz: false,
    },
    {
      id: 'chapter5',
      title: 'Chapter 5: Financial Literacy',
      content:
        'Gain essential knowledge about managing business finances, budgeting, and funding options.',
      hasQuiz: true,
    },
  ],
}

export default function CoursePage() {
  const [completedChapters, setCompletedChapters] = useState<string[]>([])
  const [quizTakenChapters, setQuizTakenChapters] = useState<string[]>([])
  const [openQuizChapterId, setOpenQuizChapterId] = useState<string | null>(null)
  const [finalQuizTaken, setFinalQuizTaken] = useState(false)

  const handleMarkDone = (chapterId: string) => {
    const chapterIndex = dummyCourse.chapters.findIndex((c) => c.id === chapterId)

    if (chapterIndex > 0) {
      const prevChapterId = dummyCourse.chapters[chapterIndex - 1].id
      if (!completedChapters.includes(prevChapterId)) {
        toast.error('Please complete the previous chapter first.')
        return
      }
    }

    const chapter = dummyCourse.chapters[chapterIndex]
    if (chapter.hasQuiz && !quizTakenChapters.includes(chapterId)) {
      toast.error('Please take the quiz before marking this chapter as done.')
      return
    }

    if (completedChapters.includes(chapterId)) {
      setCompletedChapters((prev) => prev.filter((id) => id !== chapterId))
      toast('Chapter marked as incomplete.')
    } else {
      setCompletedChapters((prev) => [...prev, chapterId])
      toast.success('Chapter marked as complete!')
    }
  }

  const handleTakeQuiz = (chapterId: string) => {
    setOpenQuizChapterId(chapterId)
  }

  const handleQuizSubmit = (chapterId: string) => {
    if (!quizTakenChapters.includes(chapterId)) {
      setQuizTakenChapters((prev) => [...prev, chapterId])
      toast.success('Quiz completed!')
    }
    setOpenQuizChapterId(null)
  }

  const isCourseComplete =
    completedChapters.length === dummyCourse.chapters.length && finalQuizTaken

  const progressPercent = finalQuizTaken
    ? 100
    : Math.round((completedChapters.length / dummyCourse.chapters.length) * 100)

  return (
    <div className="course-page">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="course-title">{dummyCourse.title}</h1>
      <p className="course-description">{dummyCourse.description}</p>

      {completedChapters.length > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      )}
      <span className="progress-text">{progressPercent}% Complete</span>

      <div className="chapter-list">
        {dummyCourse.chapters.map((chapter) => (
          <div key={chapter.id} className="chapter-card">
            <h3>{chapter.title}</h3>
            <p>{chapter.content}</p>
            <div className="chapter-actions">
              <label>
                <input
                  type="checkbox"
                  checked={completedChapters.includes(chapter.id)}
                  onChange={() => handleMarkDone(chapter.id)}
                />
                Mark as Done
              </label>
              {chapter.hasQuiz && !quizTakenChapters.includes(chapter.id) && (
                <button
                  onClick={() => handleTakeQuiz(chapter.id)}
                  className="quiz-button"
                >
                  Take Quiz
                </button>
              )}
              {chapter.hasQuiz && quizTakenChapters.includes(chapter.id) && (
                <span
                  style={{ color: 'green', marginLeft: '1rem', fontWeight: '600' }}
                >
                  Quiz Completed ✓
                </span>
              )}
            </div>

            {openQuizChapterId === chapter.id && (
              <Modal
                isOpen={true}
                onRequestClose={() => setOpenQuizChapterId(null)}
                contentLabel="Quiz Modal"
                className="quiz-modal"
                overlayClassName="quiz-overlay"
              >
                <h2>{chapter.title} - Quiz</h2>
                <p>This is a sample quiz for this chapter.</p>
                <button
                  onClick={() => handleQuizSubmit(chapter.id)}
                  className="close-button"
                >
                  Submit Quiz
                </button>
              </Modal>
            )}
          </div>
        ))}
      </div>

      {!isCourseComplete && completedChapters.length === dummyCourse.chapters.length && (
        <div className="final-quiz-section">
          <h2>🎉 All chapters done!</h2>
          <p>Ready for the final quiz?</p>
          <button
            onClick={() => {
              toast.success('Final quiz submitted! Course complete.')
              setFinalQuizTaken(true)
            }}
            className="final-quiz-button"
          >
            Take Final Quiz
          </button>
        </div>
      )}

      {isCourseComplete && (
        <div
          className="final-quiz-section"
          style={{ color: 'green', fontWeight: 'bold' }}
        >
          🎉 Congratulations! You have completed the entire course.
        </div>
      )}
    </div>
  )
}
