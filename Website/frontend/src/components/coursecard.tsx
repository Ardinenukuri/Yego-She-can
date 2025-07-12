"use client";

import React, { useState } from "react";
import { FiClock, FiBookOpen, FiBookmark } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: string;
  price: string;
  image: string;
  features: string[];
  category: string;
};

export default function CourseCard({ course }: { course: Course }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="course-card">
      <div className="course-img-wrapper">
        <img src={course.image} alt={course.title} className="course-image" />
        <button
          className="bookmark-icon"
          onClick={() => setBookmarked(!bookmarked)}
        >
          {bookmarked ? (
            <AiFillStar size={20} color="#FFD700" />
          ) : (
            <FiBookmark size={20} />
          )}
        </button>
      </div>

      <div className="course-card-header">
        <span className="course-level">{course.level}</span>
        <span className="course-price">{course.price}</span>
      </div>

      <h3 className="course-title">{course.title}</h3>
      <p className="course-desc">{course.description}</p>

      <div className="course-meta">
        <span><FiClock /> {course.duration}</span>
        <span><FiBookOpen /> {course.lessons} lessons</span>
      </div>

      <div className="course-learn">
        <strong>What you'll learn:</strong>
        <ul>
          {course.features.slice(0, 3).map((feature, i) => (
            <li key={i}>✅ {feature}</li>
          ))}
          {course.features.length > 3 && (
            <li>+{course.features.length - 3} more topics</li>
          )}
        </ul>
      </div>

      <button className="course-btn">Start Course</button>
    </div>
  );
}
