'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Clock, Calendar, MapPin } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import "./physical-program.css"; // Ensure this CSS file exists and is styled

// --- Type Definitions for our data from the backend ---
interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  next_session: string;
  location: string;
  image_url: string | null;
  skills: string[];
  requirements: string[];
  isEnrolled: boolean;

}

export default function PhysicalSession() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const [sortByDate, setSortByDate] = useState(false);
  const [durationFilter, setDurationFilter] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [showAvailable, setShowAvailable] = useState(true);


  const fetchPrograms = async () => {
    try {
        const response = await api.get('/api/learner/physical-programs');
        setPrograms(response.data.programs);
        setIsEligible(response.data.isEligible);
    } catch (error) {
        console.error("Failed to load physical programs:", error);
        toast.error("Could not load physical programs.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);


  const handleEnroll = async (programId: number) => {
    const toastId = toast.loading("Enrolling in program...");
    try {
        await api.post('/api/learner/physical-programs/enroll', { programId });
        toast.success("Successfully enrolled! We will contact you with more details.", { id: toastId });
        

        setPrograms(prev => prev.map(p => p.id === programId ? { ...p, isEnrolled: true } : p));
    } catch (error: any) {
        const message = error.response?.data?.message || "Enrollment failed.";
        toast.error(message, { id: toastId });
    }
  };


  const filteredPrograms = useMemo(() => {
    const now = new Date();
    
    return programs
      .map(program => ({
        ...program,
        comingSoon: new Date(program.next_session) > now,
      }))
      .filter(program => program.title.toLowerCase().includes(search.toLowerCase()))
      .filter(program => durationFilter ? program.duration === durationFilter : true)
      .filter(program => (showComingSoon && program.comingSoon) || (showAvailable && !program.comingSoon))
      .sort((a, b) => sortByDate ? new Date(a.next_session).getTime() - new Date(b.next_session).getTime() : 0);
  }, [programs, search, durationFilter, showAvailable, showComingSoon, sortByDate]);

  if (loading) {
    return (
        <section id="physical-sessions" className="programs-section">
            <h2>Physical Sessions</h2>
            <div className="loading-state">Loading programs...</div>
        </section>
    );
  }

  return (
    <section id="physical-sessions" className="programs-section">
      <h2>Physical Sessions</h2>


      <div className="filter-bar">
        <input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
          <option value="">All Durations</option>

          {[...new Set(programs.map(p => p.duration))].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <label><input type="checkbox" checked={showAvailable} onChange={() => setShowAvailable(!showAvailable)} /> Show Available</label>
        <label><input type="checkbox" checked={showComingSoon} onChange={() => setShowComingSoon(!showComingSoon)} /> Show Coming Soon</label>
        <button onClick={() => setSortByDate(prev => !prev)}>
          {sortByDate ? "Sorted by Date ↑" : "Sort by Upcoming Date"}
        </button>
      </div>

      {/* Programs */}
      <div className="program-list">
        {filteredPrograms.length > 0 ? filteredPrograms.map((program) => (
          <div key={program.id} className={`program-card ${program.comingSoon ? "coming-soon" : ""}`}>
            <div className="image-container">
              <img src={program.image_url ? `${process.env.NEXT_PUBLIC_API_URL}${program.image_url}` : "/placeholder-image.png"} alt={program.title} />
              {program.comingSoon && <span className="coming-badge">Coming Soon</span>}
              {!program.comingSoon && <span className="badge">Free</span>}
            </div>
            <div className="program-details">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <div className="program-meta">
                <span><Clock className="meta-icon" /> {program.duration}</span>
                <span><Calendar className="metaIcon" /> {program.next_session}</span>
                <span><MapPin className="meta-icon" /> {program.location}</span>
              </div>
              <div className="skills-section">
                <h4>Skills You'll Learn:</h4>
                <ul>{program.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
              </div>
              <div className="requirements-section">
                <h4>Requirements:</h4>
                <ul>{program.requirements.map((req, index) => <li key={index}>{req}</li>)}</ul>
              </div>
              
              {!program.comingSoon && (
                <button
                  onClick={() => handleEnroll(program.id)}
                  className="register-button"
                  disabled={!isEligible || program.isEnrolled}
                  title={!isEligible ? "You must complete all online courses to be eligible." : ""}
                >
                  {program.isEnrolled ? "Enrolled ✓" : isEligible ? "Enroll Now" : "Not Eligible"}
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <p>No physical programs match your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};