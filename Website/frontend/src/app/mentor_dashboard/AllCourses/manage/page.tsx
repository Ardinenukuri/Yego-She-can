'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiUploadCloud, FiCheckCircle } from 'react-icons/fi'
import './manage.css'

export default function CreateLessonsPage({ params }: { params: { moduleId: string } }) {
  const { moduleId } = params
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewLessons, setPreviewLessons] = useState<{ title: string; duration: string }[]>([])
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    setFile(uploadedFile || null)
    setPreviewLessons([])
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert('Please select a file to upload.')
    setUploading(true)

    // Simulate file processing
    setTimeout(() => {
      const baseName = file.name.split('.')[0]
      const fakeLessons = [
        { title: `${baseName} - Introduction`, duration: '15 min' },
        { title: `${baseName} - Core Concepts`, duration: '30 min' },
        { title: `${baseName} - Case Study`, duration: '20 min' },
        { title: `${baseName} - Quiz`, duration: '10 min' },
      ]
      setPreviewLessons(fakeLessons)
      setUploading(false)
    }, 1500)
  }

  const handleConfirm = () => {
    alert('Lessons saved!')
    router.push(`/mentor/modules/${moduleId}`)
  }

  return (
    <div className="lesson-upload-container">
      <h1 className="lesson-title">
        Upload Lesson Plan for Module {moduleId}
      </h1>

      <form onSubmit={handleUpload} className="lesson-form">
        <div>
          <label className="lesson-label">
            Select a document (PDF, DOCX)
          </label>
          <div className="lesson-input-group">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="lesson-file-input"
            />
            <FiUploadCloud className="lesson-upload-icon" />
          </div>
        </div>

        {file && (
          <div className="lesson-file-name">
            Selected: <strong>{file.name}</strong>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="lesson-upload-button"
        >
          {uploading ? 'Processing...' : 'Upload & Preview Lessons'}
        </button>
      </form>

      {previewLessons.length > 0 && (
        <div className="lesson-preview-section">
          <h2 className="lesson-preview-title">📚 Preview of Lessons Extracted:</h2>
          <ul className="lesson-preview-list">
            {previewLessons.map((lesson, index) => (
              <li key={index} className="lesson-preview-item">
                <span>{lesson.title}</span>
                <span className="lesson-duration">{lesson.duration}</span>
              </li>
            ))}
          </ul>

          <button onClick={handleConfirm} className="lesson-save-button">
            <FiCheckCircle />
            Save Lessons
          </button>
        </div>
      )}
    </div>
  )
}
