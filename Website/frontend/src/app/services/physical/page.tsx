"use client";

import React from "react";
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

export default function PhysicalProgramsPage() {
  const programs = [
    {
      id: 1,
      title: "Soap Making Workshop",
      description:
        "Learn the art of handcrafted soap making from natural ingredients",
      duration: "20 days",
      schedule: "Weekends",
      // capacity: "12 participants",
      price: "Free",
      nextSession: "Comming soon",
      location: "Yego SheCan Training Center",
      image:
        "https://c.ndtvimg.com/2020-01/vu8rka3g_soap_625x300_08_January_20.jpg",
      skills: [
        "Cold process soap making",
        "Natural ingredient selection",
        "Scenting and coloring techniques",
        "Packaging and branding",
        "Business setup basics",
        "Quality control and safety",
      ],
      requirements: [
        "No prior experience needed",
        "Must be 18+ years old",
        "Completed online entrepreneurship course",
        "Commitment to attend both days",
      ],
    },
    {
      id: 2,
      title: "Coffee Processing & Roasting",
      description:
        "Master coffee processing, roasting, and business development",
      duration: "3 days",
      schedule: "Weekends",
      // capacity: "10 participants",
      price: "Free",
      nextSession: "Coming soon",
      location: "Yego SheCan Training Center",
      image:
        "https://unocasa.com/cdn/shop/articles/types_of_coffee_91a828a5-7ff3-427d-acaa-c8b7289c9e5a_600x.jpg?v=1621261041",
      skills: [
        "Coffee bean selection and grading",
        "Processing methods (wet/dry)",
        "Roasting techniques and profiles",
        "Cupping and quality assessment",
        "Packaging and storage",
        "Market analysis and pricing",
      ],
      requirements: [
        "Basic business knowledge helpful",
        "Must be 18+ years old",
        "Completed online entrepreneurship course",
        "Physical ability to handle equipment",
      ],
    },
  ];

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
      <div className="heroButtons">
        <Link href="#programs" className="primaryButton">
          View Programs
        </Link>
        <Link href="/register" className="outlineButton">
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
                <div className="card">
                  <div className="card-header">
                    <Heart className="card-icon" />
                    <h3 className="card-title">Hands-On Learning</h3>
                  </div>
                  <div className="card-content">
                    <p>
                      Learn by doing with real equipment and materials in our
                      fully equipped training facility
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <Users className="card-icon" />
                    <h3 className="card-title">Expert Instructors</h3>
                  </div>
                  <div className="card-content">
                    <p>
                      Learn from successful women entrepreneurs who have built
                      thriving soap and coffee businesses
                    </p>
                  </div>
                </div>

                <div className="card dark-card">
                  <div className="card-header">
                    <Award className="card-icon" />
                    <h3 className="card-title">Business Ready</h3>
                  </div>
                  <div className="card-content">
                    <p>
                      Graduate with the skills and knowledge needed to start
                      your own profitable business
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <CheckCircle className="card-icon" />
                    <h3 className="card-title">Ongoing Support</h3>
                  </div>
                  <div className="card-content">
                    <p>
                      Receive continued mentorship and business support after
                      completing your training
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="prerequisitesContainer">
            <h2>Program Prerequisites</h2>
            <div className="prerequisitesGrid">
              <div>
                <h4>Before You Apply:</h4>
                <ul>
                  <li>
                    <CheckCircle className="checkIcon" /> Complete our online
                    entrepreneurship courses
                  </li>
                  <li>
                    <CheckCircle className="checkIcon" /> Pass the online course
                    assessments
                  </li>
                  <li>
                    <CheckCircle className="checkIcon" /> Attend a virtual
                    orientation session
                  </li>
                  <li>
                    <CheckCircle className="checkIcon" /> Submit a brief
                    business plan outline
                  </li>
                </ul>
              </div>
              <div>
                <h4>What's Included:</h4>
                <ul>
                  <li>
                    <CheckCircle className="checkIcon" /> All materials and
                    equipment provided
                  </li>
                  <li>
                    <CheckCircle className="checkIcon" /> Take-home starter kit
                  </li>
                  <li>
                    <CheckCircle className="checkIcon" /> Lunch and refreshments
                  </li>
                  <li>
                    <CheckCircle className="checkIcon" /> Certificate of
                    completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="programsSection">
          <h2>Available Programs</h2>
          <div className="programList">
            {programs.map((program) => (
              <div key={program.id} className="programCard">
                <div className="imageContainer">
                  <img src={program.image} alt={program.title} />
                  <span className="badge">{program.price}</span>
                </div>
                <div className="programDetails">
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <div className="programMeta">
                    <span>
                      <Clock className="metaIcon" /> {program.duration}
                    </span>
                    {/* <span>
                      <Users className="metaIcon" /> {program.capacity}
                    </span> */}
                    <span>
                      <Calendar className="metaIcon" /> {program.nextSession}
                    </span>
                    <span>
                      <MapPin className="metaIcon" /> {program.location}
                    </span>
                  </div>

                  <div className="skillsSection">
                    <h4>Skills You'll Learn:</h4>
                    <ul>
                      {program.skills.map((skill, index) => (
                        <li key={index}>
                           {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="requirementsSection">
                    <h4>Requirements:</h4>
                    <ul>
                      {program.requirements.map((req, index) => (
                        <li key={index}>
                           {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/register`}
                    className="registerButton"
                  >
                    Register for This Program
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ctaSection">
          <h2>Ready to Learn a New Skill?</h2>
          <p>
            Transform your life with practical skills that can generate income.
            Our physical programs provide everything you need to start your own
            business.
          </p>
          <div className="ctaButtons">
            <Link href="/services/courses" className="secondaryButton">
              Start with Online Courses
            </Link>
            <Link href="/contact" className="outlineLightButton">
              Have Questions?
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}