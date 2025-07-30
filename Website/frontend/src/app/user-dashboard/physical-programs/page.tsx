import React from "react";
import { Clock, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import "./physical-program.css";

const physicalPrograms = [
  {
    id: 1,
    title: "Coffee Making",
    description: "Learn the art of brewing perfect coffee from scratch.",
    image_url: "/coffee-beans.jpg",
    duration: "2 weeks",
    next_session: "Aug 10, 2025",
    location: "Kigali, Rwanda",
    skills: ["Grinding", "Brewing", "Latte Art"],
    requirements: ["Basic kitchen tools", "Passion for coffee"],
    comingSoon: false,
  },
  {
    id: 2,
    title: "Soap Making",
    description: "Create handmade organic soaps with essential oils.",
    image_url: "/black-soap.jpg",
    duration: "3 weeks",
    next_session: "Aug 15, 2025",
    location: "Huye, Rwanda",
    skills: ["Mixing", "Scent crafting", "Packaging"],
    requirements: ["Protective gloves", "Essential oils"],
    comingSoon: false,
  },
  {
    id: 3,
    title: "Candle Crafting",
    description: "Master the art of creating handmade scented candles.",
    image_url: "https://www.shutterstock.com/shutterstock/photos/2490134887/display_1500/stock-photo-home-comfort-coziness-aromatherapy-cozy-interior-with-knitting-burning-candles-and-aroma-2490134887.jpg",
    duration: "2 weeks",
    next_session: "Aug 20, 2025",
    location: "Musanze, Rwanda",
    skills: ["Wax molding", "Fragrance mixing", "Color blending"],
    requirements: ["Candle molds", "Fragrance oils"],
    comingSoon: true,
  },
];

const PhysicalSession = () => {
  return (
    <section id="physical-sessions" className="programs-section">
      <h2>Physical Sessions</h2>
      <div className="program-list">
        {physicalPrograms.map((program) => (
          <div
            key={program.id}
            className={`program-card ${program.comingSoon ? "coming-soon" : ""}`}
          >
            <div className="image-container">
              <img src={program.image_url} alt={program.title} />
              {program.comingSoon && <span className="coming-badge">Coming Soon</span>}
              {!program.comingSoon && <span className="badge">Free</span>}
            </div>
            <div className="program-details">
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <div className="program-meta">
                <span><Clock className="meta-icon" /> {program.duration}</span>
                <span><Calendar className="meta-icon" /> {program.next_session}</span>
                <span><MapPin className="meta-icon" /> {program.location}</span>
              </div>
              <div className="skills-section">
                <h4>Skills You'll Learn:</h4>
                <ul>
                  {program.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="requirements-section">
                <h4>Requirements:</h4>
                <ul>
                  {program.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              {!program.comingSoon && (
                <Link href="/auth/register" className="register-button">
                  Register to Enroll
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhysicalSession;
