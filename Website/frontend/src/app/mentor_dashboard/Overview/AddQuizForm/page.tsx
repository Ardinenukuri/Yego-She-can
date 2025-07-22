'use client'

import { useState, useEffect } from 'react'
import QuizPreview from '../QuizPreview/page'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// Type Definitions
interface Course { id: number; title: string; }
interface Chapter { id: number; title: string; }
interface QuizQuestion { question: string; options: string[]; correct_answer: string; }

export default function AddQuizForm() {
  // State for UI control
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for form selections
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [quizScope, setQuizScope] = useState<'chapter' | 'final' | ''>('');
  
  // State for the generated quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Fetch the mentor's assigned courses on component mount
  useEffect(() => {
    const fetchMentorCourses = async () => {
      try {
        const response = await api.get('/api/mentor/courses');
        setCourses(response.data);
      } catch (error) {
        toast.error("Could not load your assigned courses.");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchMentorCourses();
  }, []);

  // Fetch chapters whenever a new course is selected
  useEffect(() => {
    if (selectedCourseId && quizScope === 'chapter') {
      const fetchChapters = async () => {
        setIsLoadingChapters(true);
        setChapters([]);
        try {
          const response = await api.get(`/api/mentor/courses/${selectedCourseId}/chapters`);
          setChapters(response.data);
        } catch (error) {
          toast.error("Could not load chapters for this course.");
        } finally {
          setIsLoadingChapters(false);
        }
      };
      fetchChapters();
    } else {
      setChapters([]); // Clear chapters if scope is not chapter-based
    }
  }, [selectedCourseId, quizScope]);

  const handleGenerateQuiz = async () => {
    let endpoint = '';
    let payload = {};

    if (quizScope === 'final') {
      endpoint = '/api/quizzes/final';
      payload = { courseId: parseInt(selectedCourseId) };
    } else if (quizScope === 'chapter' && selectedChapterId) {
      endpoint = '/api/quizzes/chapter';
      payload = { courseId: parseInt(selectedCourseId), chapterId: parseInt(selectedChapterId) };
    } else {
      toast.error("Please complete your selection.");
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading("Generating AI quiz... this may take a moment.");
    try {
      const response = await api.post(endpoint, payload);
      setQuestions(response.data.quiz.questions);
      toast.success("Quiz questions generated successfully!", { id: toastId });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to generate quiz.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === parseInt(selectedCourseId));

  return (
    <div className="quiz-card">
      <h2 className="form-header">Quiz Setup</h2>

      <div className="form-group">
        <label>Choose a Course:</label>
        <select value={selectedCourseId} onChange={e => {
          setSelectedCourseId(e.target.value);
          // Reset downstream selections
          setSelectedChapterId('');
          setQuizScope('');
          setQuestions([]);
        }} disabled={isLoadingCourses}>
          <option value="" disabled>{isLoadingCourses ? "Loading..." : "-- Select Course --"}</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <div className="form-group">
          <label>Quiz Scope:</label>
          <select value={quizScope} onChange={e => {
            setQuizScope(e.target.value as 'chapter' | 'final');
            setSelectedChapterId('');
            setQuestions([]);
          }}>
            <option value="" disabled>-- Select Scope --</option>
            <option value="chapter">Chapter-based Quiz</option>
            <option value="final">Final Course Quiz</option>
          </select>
        </div>
      )}

      {quizScope === 'chapter' && (
        <div className="form-group">
          <label>Select Chapter:</label>
          <select value={selectedChapterId} onChange={e => {
            setSelectedChapterId(e.target.value);
            setQuestions([]);
          }} disabled={isLoadingChapters}>
            <option value="" disabled>{isLoadingChapters ? "Loading..." : "-- Select Chapter --"}</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.title}</option>
            ))}
          </select>
        </div>
      )}

      {quizScope && (quizScope === 'final' || selectedChapterId) && (
        <button className="generate-btn" onClick={handleGenerateQuiz} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate AI Questions'}
        </button>
      )}

      {questions.length > 0 && (
        <>
          <QuizPreview questions={questions} />
          {/* Save functionality is already part of generation, so no separate save button is needed */}
        </>
      )}
    </div>
  )
}