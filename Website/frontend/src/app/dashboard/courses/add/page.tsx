'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './add.css'; 
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Course {
  id: number;
  name: string;
}

// Interface for the new Physical Program form
interface PhysicalProgramForm {
    title: string;
    description: string;
    duration: string;
    schedule: string;
    nextSession: string;
    location: string;
    skills: string; // Will be a comma-separated string from the input
    requirements: string; // Will be a comma-separated string
    image: File | null;
}

export default function AddCoursePage() {
  const [courseTitle, setCourseTitle] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const router = useRouter();
  
  // --- NEW: State for the Physical Program Form ---
  const [physicalProgramForm, setPhysicalProgramForm] = useState<PhysicalProgramForm>({
    title: '',
    description: '',
    duration: '',
    schedule: '',
    nextSession: '',
    location: '',
    skills: '',
    requirements: '',
    image: null,
  });
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  
  // Your existing state for the Invite Mentor form (commented out in your example, so I've left it out for now)

  const handleCourseSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsAddingCourse(true);
    const toastId = toast.loading('Adding new online course...');
    
    try {
      await api.post('/api/courses', { name: courseTitle });
      toast.success('Online course added successfully!', { id: toastId });
      setCourseTitle('');
      // Optionally, you can refetch the courses list here if you re-enable the invite form
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Failed to add course.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsAddingCourse(false);
    }
  };

  // --- NEW: Handlers for the Physical Program Form ---
  const handleProgramFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPhysicalProgramForm({ ...physicalProgramForm, [e.target.name]: e.target.value });
  };

  const handleProgramFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhysicalProgramForm({ ...physicalProgramForm, image: e.target.files[0] });
    }
  };

  const handleProgramSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!physicalProgramForm.image) {
        toast.error("Please upload an image for the program.");
        return;
    }
    setIsAddingProgram(true);
    const toastId = toast.loading('Adding new physical program...');

    const formData = new FormData();
    formData.append('title', physicalProgramForm.title);
    formData.append('description', physicalProgramForm.description);
    formData.append('duration', physicalProgramForm.duration);
    formData.append('schedule', physicalProgramForm.schedule);
    formData.append('nextSession', physicalProgramForm.nextSession);
    formData.append('location', physicalProgramForm.location);
    // Split the comma-separated strings into arrays for the backend
    formData.append('skills', `{${physicalProgramForm.skills}}`);
    formData.append('requirements', `{${physicalProgramForm.requirements}}`);
    formData.append('image', physicalProgramForm.image);

    try {
      await api.post('/api/pm/physical-programs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Physical program added successfully!', { id: toastId });
      // Redirect to the courses management page on success
      router.push('/dashboard/courses');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add physical program.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsAddingProgram(false);
    }
  };

  return (
    <div className="add-course-container">
      {/* --- ADD ONLINE COURSE CARD --- */}
      <div className="add-course-card">
        <h1 className="add-course-title">Add New Online Course</h1>
        <form onSubmit={handleCourseSubmit} className="add-course-form">
          <label>Course Name</label>
          <input
            name="title"
            value={courseTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCourseTitle(e.target.value)}
            required
            placeholder="e.g. Digital Marketing 101"
            disabled={isAddingCourse}
          />
          <button type="submit" className="submit-btn" disabled={isAddingCourse}>
            {isAddingCourse ? 'Adding...' : 'Add Online Course'}
          </button>
        </form>
      </div>

      {/* --- NEW: ADD PHYSICAL PROGRAM CARD --- */}
      <div className="add-course-card">
        <h1 className="add-course-title">Add New Physical Program</h1>
        <form onSubmit={handleProgramSubmit} className="add-course-form">
          <label>Program Title</label>
          <input name="title" value={physicalProgramForm.title} onChange={handleProgramFormChange} required placeholder="e.g. Soap Making Workshop" disabled={isAddingProgram} />
          
          <label>Description</label>
          <textarea name="description" value={physicalProgramForm.description} onChange={handleProgramFormChange} required placeholder="A brief summary of the program" disabled={isAddingProgram}></textarea>
          
          <div className="form-row">
            <label>Duration<input name="duration" value={physicalProgramForm.duration} onChange={handleProgramFormChange} required placeholder="e.g., 2 Days" disabled={isAddingProgram} /></label>
            <label>Schedule<input name="schedule" value={physicalProgramForm.schedule} onChange={handleProgramFormChange} required placeholder="e.g., Weekends" disabled={isAddingProgram} /></label>
          </div>

          <div className="form-row">
            <label>Next Session Date<input name="nextSession" value={physicalProgramForm.nextSession} onChange={handleProgramFormChange} required placeholder="e.g., August 15th" disabled={isAddingProgram} /></label>
            <label>Location<input name="location" value={physicalProgramForm.location} onChange={handleProgramFormChange} required placeholder="e.g., Yego SheCan Center" disabled={isAddingProgram} /></label>
          </div>

          <label>Skills (comma-separated)</label>
          <input name="skills" value={physicalProgramForm.skills} onChange={handleProgramFormChange} required placeholder="e.g., Cold process, Scenting, Branding" disabled={isAddingProgram} />
          
          <label>Requirements (comma-separated)</label>
          <input name="requirements" value={physicalProgramForm.requirements} onChange={handleProgramFormChange} required placeholder="e.g., 18+ years old, Commitment" disabled={isAddingProgram} />
          
          <label>Program Image *</label>
          <input type="file" name="image" onChange={handleProgramFileChange} required accept="image/*" disabled={isAddingProgram} />

          <button type="submit" className="submit-btn" disabled={isAddingProgram}>
            {isAddingProgram ? 'Adding...' : 'Add Physical Program'}
          </button>
        </form>
      </div>
    </div>
  );
}