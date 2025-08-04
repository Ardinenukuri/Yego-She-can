'use client';

import './editlesson.css'; 
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface MentorCourse {
  id: number;
  title: string;
}

type FileState = File | null;

export default function UploadCourseResourcePage() {
  const [courseId, setCourseId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [level, setLevel] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [resourceFile, setResourceFile] = useState<FileState>(null);
  const [courseImage, setCourseImage] = useState<FileState>(null);
  
  const [mentorCourses, setMentorCourses] = useState<MentorCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/mentor/courses');
        setMentorCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch mentor's courses:", error);
        toast.error("Could not load your assigned courses.");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'resourceFile') {
        setResourceFile(files[0]);
      } else if (name === 'courseImage') {
        setCourseImage(files[0]);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!resourceFile || !courseImage) {
        toast.error("Both a resource file and a course image are required.");
        return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading resource...');

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('description', description);
    formData.append('timeline', timeline);
    formData.append('level', level.toLowerCase()); 
    formData.append('videoLink', videoLink);
    formData.append('resourceFile', resourceFile);
    formData.append('courseImage', courseImage);

    try {
      await api.post('/api/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Course resource uploaded successfully!', { id: toastId });
      router.push('/AllCourses');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Upload failed. Please check your inputs.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-resource-container">
      <h1>Upload Course Resource</h1>
      <p className="page-subtitle">Fill out the details to add a new set of materials to one of your assigned courses.</p>
      
      <form className="upload-resource-form" onSubmit={handleSubmit}>
        <label>
          Course Title *
        </label>
        <select 
            name="courseId" 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)} 
            required 
            disabled={isLoadingCourses || isUploading}
        >
            <option value="" disabled>
              {isLoadingCourses ? 'Loading your courses...' : 'Select a course'}
            </option>
            {mentorCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
        </select>

        <label>
          Description *
        </label>
        <textarea 
            name="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            disabled={isUploading} 
        />

        <label>
          Timeline *
        </label>
        <input 
            type="text" 
            name="timeline" 
            value={timeline} 
            onChange={(e) => setTimeline(e.target.value)} 
            required 
            placeholder="e.g., 4 Weeks"
            disabled={isUploading} 
        />

        <label>
          Level *
        </label>
        <select 
            name="level" 
            value={level} 
            onChange={(e) => setLevel(e.target.value)} 
            required 
            disabled={isUploading}
        >
            <option value="" disabled>Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
        </select>

        {/* NEW: Video Link Input Field (Optional) */}
        <label>
          Video Link (Optional)
        </label>
        <input
          type="text"
          name="videoLink"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="e.g., https://www.youtube.com/watch?v=..."
          disabled={isUploading}
        />

        <label>
          Resource File (PDF, DOCX) *
        </label>
        <input 
            type="file" 
            name="resourceFile" 
            onChange={handleFileChange} 
            required
            accept=".pdf,.doc,.docx"
            disabled={isUploading} 
        />

        <label>
          Course Image *
        </label>
        <input 
            type="file" 
            name="courseImage" 
            onChange={handleFileChange} 
            required
            accept="image/*"
            disabled={isUploading} 
        />

        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Resource'}
        </button>
      </form>
    </div>
  );
}