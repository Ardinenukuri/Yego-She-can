'use client'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './allQuiz.css' // Ensure you have this CSS file
import api from '@/lib/api'
import toast from 'react-hot-toast'


// Define a type for the data we expect from the backend
type Quiz = {
  quizId: number;
  title: string;
  course: string;
  totalStudents: number;
  passed: number;
  failed: number;
  expectedStudents: number;
}


export default function AllQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  // Fetch data from the new backend endpoint
  useEffect(() => {
    const fetchQuizOverview = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/mentor/quizzes/overview');
            setQuizzes(response.data);
        } catch (error) {
            console.error("Failed to fetch quiz overview:", error);
            toast.error("Could not load quiz overview data.");
        } finally {
            setLoading(false);
        }
    };
    fetchQuizOverview();
  }, []);


  if (loading) {
    return (
        <div className="quizzes-page-admin">
            <div className="admin-header">
                <h1>Quiz Overview</h1>
            </div>
            <div className="loading-state">Loading quiz data...</div>
        </div>
    );
  }


  return (
    <div className="quizzes-page-admin">
      <div className="admin-header">
        <h1>Quiz Overview</h1>
        <button className="create-quiz-btn" onClick={() => router.push('/mentor_dashboard/Overview')}>
           +Create Quizzes
        </button>
      </div>


      <table className="courses-table">
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Course</th>
            <th>Expected</th>
            <th>Attempted</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Missed</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => {
            const missed = quiz.expectedStudents - quiz.totalStudents;
            return (
              <tr key={quiz.quizId}>
                <td>{quiz.title}</td>
                <td>{quiz.course}</td>
                <td>{quiz.expectedStudents}</td>
                <td>{quiz.totalStudents}</td>
                <td className="passed">{quiz.passed}</td>
                <td className="failed">{quiz.failed}</td>
                <td className="missed">{missed > 0 ? missed : 0}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
     
      {quizzes.length === 0 && !loading && (
        <div className="empty-state">
            <p>No quizzes found for your assigned courses.</p>
        </div>
      )}
    </div>
  )
}

