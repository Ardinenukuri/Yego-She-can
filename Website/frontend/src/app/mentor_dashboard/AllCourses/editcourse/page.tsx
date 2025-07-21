'use client';

import './editlesson.css';
import { useState } from 'react';

export default function UploadCourseResourcePage() {
  const [form, setForm] = useState({
    courseTitle: '',
    description: '',
    timeline: '',
    level: '',
    resourceFile: null,
    courseImage: null,
  });

  const courseOptions = [
    'Intro to Agriculture',
    'Livestock Management',
    'Smart Farming Basics',
    'Agri-Tech Innovation',
  ];

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('courseTitle', form.courseTitle);
    formData.append('description', form.description);
    formData.append('timeline', form.timeline);
    formData.append('level', form.level);
    if (form.resourceFile) formData.append('resourceFile', form.resourceFile);
    if (form.courseImage) formData.append('courseImage', form.courseImage);

    alert('Course resource uploaded successfully!');
  };

  return (
    <div className="upload-resource-container">
      <h1>Upload Course Resource</h1>
      <form className="upload-resource-form" onSubmit={handleSubmit}>
        <label>
          Course Title
          <select name="courseTitle" value={form.courseTitle} onChange={handleChange} required>
            <option value="" disabled>Select a course</option>
            {courseOptions.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>

        <label>
          Timeline
          <input type="text" name="timeline" value={form.timeline} onChange={handleChange} required />
        </label>

        <label>
          Level
          <select name="level" value={form.level} onChange={handleChange} required>
            <option value="" disabled>Select level</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>

        <label>
          Resource File (PDF, DOCX...)
          <input type="file" name="resourceFile" onChange={handleFileChange} />
        </label>

        <label>
          Course Image
          <input type="file" name="courseImage" onChange={handleFileChange} />
        </label>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
