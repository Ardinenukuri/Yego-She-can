'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
import '@/styles/courseses.css';

interface Chapter {
  id: number;
  title: string;
  content: string;
  quizId: number | null;
  isCompleted: boolean;
  quizPassed: boolean;
}

interface CourseData {
  id: number;
  title: string;
  description: string;
  videoLink?: string | null;
  chapters: Chapter[];
  finalQuiz: {
    quizId: number;
    isCompleted: boolean;
  } | null;
}

export default function CoursePage() {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const fetchCourseData = async () => {
    if (!courseId) return;
    try {
      if (!course) setLoading(true);
      const response = await api.get(`/api/courses/learn/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      toast.error("Failed to load course content.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleMarkDone = async (chapterId: number) => {
    try {
      const response = await api.post('/api/courses/chapters/toggle-completion', { chapterId });
      setCourse(prevCourse => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          chapters: prevCourse.chapters.map(ch =>
            ch.id === chapterId ? { ...ch, isCompleted: response.data.completed } : ch
          )
        };
      });
      toast.success(response.data.completed ? "Chapter marked as complete!" : "Chapter marked as incomplete.");
    } catch (error) {
      toast.error("Failed to update chapter status.");
    }
  };

  const transformToEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch (e) {
      console.error("Invalid URL for video embedding:", e);
    }
    return url;
  };

  const completedChaptersCount = course?.chapters.filter(c => c.isCompleted).length || 0;
  const totalChapters = course?.chapters.length || 0;
  const progressPercent = totalChapters > 0 ? Math.round((completedChaptersCount / totalChapters) * 100) : 0;

  if (loading) return <div className="course-page"><h1>Loading Course...</h1></div>;
  if (!course) return <div className="course-page"><h1>Course not found.</h1></div>;

  const embedUrl = course.videoLink ? transformToEmbedUrl(course.videoLink) : null;

  return (
    <div className="course-page">
      <Toaster position="top-right" />
      <h1 className="course-title">{course.title}</h1>
      <p className="course-description">{course.description}</p>

      {embedUrl && (
        <div className="video-section">
          <h2>Course Video</h2>
          <div className="video-responsive">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={course.title}
            ></iframe>
          </div>
        </div>
      )}

      <div className="progress-bar-container" style={{ margin: '1.5rem 0' }}>
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        <span className="progress-text">{progressPercent}% Complete ({completedChaptersCount} / {totalChapters} Chapters)</span>
      </div>

      <div className="chapter-list">
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className={`chapter-card ${chapter.isCompleted ? 'completed' : ''}`}>
            <h3>{chapter.title}</h3>
            <p>{chapter.content}</p>
            <div className="chapter-actions">
              <label className="mark-done-label">
                <input
                  type="checkbox"
                  checked={chapter.isCompleted}
                  onChange={() => handleMarkDone(chapter.id)}
                />
                Mark as Done
              </label>
              {chapter.quizId && (
                chapter.quizPassed ? (
                  <span className="quiz-status-completed">Quiz Passed ✓</span>
                ) : (
                  <Link href={`/user-dashboard/quiz/${chapter.quizId}`} className="quiz-button">
                    Take Chapter Quiz
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {course.finalQuiz && (
        <div className="final-quiz-section">
          {course.finalQuiz.isCompleted ? (
            <div className="course-complete-message">
              <h2>🎉 Final Quiz Passed!</h2>
              <p>Congratulations! You have earned your certificate. View it in your profile.</p>
            </div>
          ) : (
            <>
              <h2>Ready for the Final Challenge?</h2>
              <p>Take the final quiz to complete the course and earn your certificate.</p>
              <Link href={`/user-dashboard/quiz/${course.finalQuiz.quizId}`} className="final-quiz-button">
                Take Final Quiz
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}