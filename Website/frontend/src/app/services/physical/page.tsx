'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../../../styles/PhysicalProgramsPage.css";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Award,
  Heart,
} from "lucide-react";
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Interface for the full program details displayed in the list
interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  schedule: string;
  next_session: string;
  location: string;
  image_url: string | null;
  skills: string[];
  requirements: string[];
}

// Interface for the specific data needed for the countdown timer
interface NextProgram {
  title: string;
  next_session: string; // This will be an ISO date string from the DB
}

export default function PhysicalProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the next program's data and the countdown display string
  const [nextProgram, setNextProgram] = useState<NextProgram | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  // Fetch all necessary data when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            // Use Promise.all to fetch data concurrently for better performance
            const [programsResponse, nextProgramResponse] = await Promise.all([
                api.get('/api/public/physical-programs'),
                api.get('/api/public/next-physical-program') 
            ]);
            setPrograms(programsResponse.data);
            setNextProgram(nextProgramResponse.data); // This will be the program object or null
        } catch (error) {
            console.error("Failed to load page data:", error);
            toast.error("Could not load program information.");
        } finally {
            setLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  // Effect to handle the countdown logic, dependent on the fetched nextProgram
  useEffect(() => {
    // If there is no upcoming program, set a message and stop.
    if (!nextProgram) {
      setCountdown("No upcoming workshops scheduled. Please check back soon!");
      return;
    }

    const interval = setInterval(() => {
      const countdownDate = new Date(nextProgram.next_session).getTime();
      const now = new Date().getTime();
      const difference = countdownDate - now;

      // If the countdown is over
      if (difference <= 0) {
        setCountdown(`The ${nextProgram.title} workshop has started!`);
        clearInterval(interval);
        return;
      }

      // Calculate time parts
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Set the dynamic countdown string
      setCountdown(
        `${days}d ${hours}h ${minutes}m ${seconds}s until our ${nextProgram.title} program`
      );
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or nextProgram changes
    return () => clearInterval(interval);

  }, [nextProgram]); // This effect will re-run if the nextProgram data ever changes


  if (loading) {
    return (
        <div className="page-wrapper">
            <div className="pageWrapper">
                <section className="heroSection">
                    {/* Minimal hero during load */}
                </section>
                <div className="loading-state">Loading Programs...</div>
            </div>
        </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="pageWrapper">
        <section className="heroSection">
          <div className="heroOverlay">
            <div className="heroContent">
              <h1>
                Hands-On <span>Training</span> Programs
              </h1>
              <p>
                Learn practical skills through our intensive hands-on workshops.
                Master soap making and coffee processing while building the
                foundation for your own business.
              </p>
              <div className="countdown-timer">
                <strong>Next Workshop starts in:</strong>
                <div style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
                  {countdown}
                </div>
              </div>
              <div className="heroButtons">
                <a href="#programs" className="primaryButton">
                  View Programs
                </a>
                <Link href="/auth/register" className="outlineButton">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="whyChooseSection">
          <h2>Why Choose Our Physical Programs?</h2>
          <section className="hero-details">
            <div className="hero-left">
              <img
                src="https://myayep.org/wp-content/uploads/elementor/thumbs/palms-up-hands-happy-group-multinational-african-latin-american-european-people-who-stay-together-circle-qftjwkd3vv6ucvihckmufycf6yohxufix7nbhgwtl6.jpg"
                alt="Empowering Women Entrepreneurs"
              />
            </div>
            <div className="hero-right">
              <div className="card-grid">
                <div className="card"><div className="card-header"><Heart className="card-icon" /><h3 className="card-title">Hands-On Learning</h3></div><div className="card-content"><p>Learn by doing with real equipment and materials in our fully equipped training facility</p></div></div>
                <div className="card"><div className="card-header"><Users className="card-icon" /><h3 className="card-title">Expert Instructors</h3></div><div className="card-content"><p>Learn from successful women entrepreneurs who have built thriving soap and coffee businesses</p></div></div>
                <div className="card dark-card"><div className="card-header"><Award className="card-icon" /><h3 className="card-title">Business Ready</h3></div><div className="card-content"><p>Graduate with the skills and knowledge needed to start your own profitable business</p></div></div>
                <div className="card"><div className="card-header"><CheckCircle className="card-icon" /><h3 className="card-title">Ongoing Support</h3></div><div className="card-content"><p>Receive continued mentorship and business support after completing your training</p></div></div>
              </div>
            </div>
          </section>
          <div className="prerequisitesContainer">
            <h2>Program Prerequisites</h2>
            <div className="prerequisitesGrid">
              <div><h4>Before You Apply:</h4><ul><li><CheckCircle className="checkIcon" /> Complete our online entrepreneurship courses</li><li><CheckCircle className="checkIcon" /> Pass the online course assessments</li><li><CheckCircle className="checkIcon" /> Attend a virtual orientation session</li><li><CheckCircle className="checkIcon" /> Submit a brief business plan outline</li></ul></div>
              <div><h4>What's Included:</h4><ul><li><CheckCircle className="checkIcon" /> All materials and equipment provided</li><li><CheckCircle className="checkIcon" /> Take-home starter kit</li><li><CheckCircle className="checkIcon" /> Lunch and refreshments</li><li><CheckCircle className="checkIcon" /> Certificate of completion</li></ul></div>
            </div>
          </div>
        </section>

        <section id="programs" className="programsSection">
          <h2>Available Programs</h2>
          <div className="programList">
            {programs.map((program) => (
              <div key={program.id} className="programCard">
                <div className="imageContainer">
                  <img src={program.image_url ? `${process.env.NEXT_PUBLIC_API_URL}${program.image_url}` : "/placeholder-image.png"} alt={program.title} />
                  <span className="badge">Free</span>
                </div>
                <div className="programDetails">
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <div className="programMeta">
                    <span><Clock className="metaIcon" /> {program.duration}</span>
                    <span><Calendar className="metaIcon" /> {new Date(program.next_session).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span><MapPin className="metaIcon" /> {program.location}</span>
                  </div>
                  <div className="skillsSection">
                    <h4>Skills You'll Learn:</h4>
                    <ul>{program.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
                  </div>
                  <div className="requirementsSection">
                    <h4>Requirements:</h4>
                    <ul>{program.requirements.map((req, index) => <li key={index}>{req}</li>)}</ul>
                  </div>
                  <Link
                    href={`/auth/register`} 
                    className="registerButton"
                  >
                    Register to Enroll
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ctaSection">
          <h2>Ready to Learn a New Skill?</h2>
          <p>Transform your life with practical skills that can generate income. Our physical programs provide everything you need to start your own business.</p>
          <div className="ctaButtons">
            <Link href="/services/courses" className="secondaryButton">Start with Online Courses</Link>
            <Link href="/contact" className="outlineLightButton">Have Questions?</Link>
          </div>
        </section>
      </div>
    </div>
  );
}