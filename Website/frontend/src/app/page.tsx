'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'

import {
  FaChalkboardTeacher,
  FaHandHoldingHeart,
  FaShoppingBasket,
} from 'react-icons/fa'
import { FiAward, FiUsers, FiTarget } from 'react-icons/fi'
import heroImage from '../../public/home.jpg'
import './home.css'

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

  const values = [
    {
      icon: <FiAward />,
      title: 'Excellence',
      description:
        'We uphold the highest standards in all our training, mentorship, and support services.',
    },
    {
      icon: <FiUsers />,
      title: 'Community',
      description:
        'We foster a strong sisterhood where women uplift each other and grow together.',
    },
    {
      icon: <FiTarget />,
      title: 'Accessibility',
      description:
        'Our programs are designed to be inclusive, affordable, and easily accessible to all women.',
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <Image
          src={heroImage}
          alt="Empowered woman with laptop"
          className="hero-image"
          priority
        />
        <div className="hero-overlay">
          <div className="hero-content" data-aos="fade-up">
            <h1>
              Empowering Women, <span className="highlight">One Skill</span> at a Time
            </h1>
            <p>
              Yego SheCan uplifts underserved women through business training, mentorship, and access to digital markets.
            </p>
            <div className="hero-buttons">
              <Link href="/mentorship">
                <button className="btn-primary">Find a Mentor</button>
              </Link>
              <Link href="/services/courses">
                <button className="btn-outline">Explore Courses</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="about-section" data-aos="fade-up">
        <h2>What We Do</h2>
        <p>
          At Yego SheCan, we equip women with the knowledge and tools to build sustainable businesses. From practical entrepreneurship training to mentorship and digital sales support, our holistic approach ensures long-term impact and independence.
        </p>
      </section>

      {/* Services */}
      <section className="features-section" data-aos="fade-up">
        <div className="feature-card">
          <FaChalkboardTeacher className="feature-icon" />
          <h3>Entrepreneurship Training</h3>
          <p>
            Learn the foundations of running a successful business with our free courses in Sales, Marketing, Accounting, and more.
          </p>
        </div>
        <div className="feature-card">
          <FaHandHoldingHeart className="feature-icon" />
          <h3>Mentorship</h3>
          <p>
            Connect with experienced women leaders who offer personal guidance, real-world insights, and motivation to help you grow.
          </p>
        </div>
        <div className="feature-card">
          <FaShoppingBasket className="feature-icon" />
          <h3>Product Marketplace</h3>
          <p>
            Sell handmade items like soaps and coffee through our online platform and reach a wider customer base.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section card-section" data-aos="fade-up">
        <div className="card-content">
          <h2>Our Story</h2>
          <p>
            <strong style={{ color: '#7c34ab' }}>Yego SheCan</strong> was founded on the belief that every woman has the right to rewrite her future. Recognizing the lack of access to education, mentorship, and financial tools, we built a platform to unlock women’s potential.
          </p>
          <p>
            Starting as a grassroots initiative with a handful of mentors and eager learners, we organized workshops, shared stories, and created safe spaces where women felt seen and heard. These moments sparked transformation.
          </p>
          <p>
            Today, we’ve grown into a nationwide movement with physical workshops, online courses, and a thriving mentorship ecosystem. We empower women to start businesses, create jobs, and become changemakers in their own communities.
          </p>
          <p>
            <em>Our story is just beginning — and you can be part of it.</em>
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section values" data-aos="fade-up">
        <h2>Our Values</h2>
        <div className="values-cards">
          {values.map(({ icon, title, description }) => (
            <div key={title} className="value-card" data-aos="zoom-in">
              <div className="card-icon-wrapper">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Process Timeline */}
      <section className="our-process-section" data-aos="fade-up">
        <h2 className="process-title">Our Process</h2>
        <p className="process-intro">
          We guide every woman through an empowering journey from learning to launching.
        </p>
        <div className="timeline">
          {[
            {
              title: '1. Register',
              desc: 'Create a free account to access our learning resources and mentorship programs.',
              points: ['Set up your learner profile', 'Select your learning goals'],
            },
            {
              title: '2. Enroll in Courses',
              desc: 'Start learning essential entrepreneurship topics like Sales, Marketing, and Accounting.',
              points: ['Interactive lessons & community projects', 'Track your progress'],
            },
            {
              title: '3. Get Mentorship',
              desc: 'Connect with successful women mentors to help guide your business journey.',
              points: ['Book free one-on-one sessions', 'Receive personalized business advice'],
            },
            {
              title: '4. Join a Practical Program',
              desc: 'Participate in soap or coffee production projects and learn how to turn skills into income.',
              points: ['Hands-on entrepreneurship', 'Collaborate with other learners'],
            },
             {
              title: '5. Get a Certificate',
              desc: 'After completing the physical program get a certificate that shows your skills .',
              points: ['Get yourself certified'],
            },
            {
              title: '6. Sell on Our E-commerce',
              desc: 'Launch your products through our online marketplace and reach supportive customers.',
              points: ['Set up your shop', 'Manage orders and grow your brand'],
            },
          ].map((item, index) => (
            <div
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              data-aos="fade-up"
              key={item.title}
            >
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <ul>
                {item.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" data-aos="fade-up">
        <h2>Join Our Community Today</h2>
        <p>
          Whether you're just starting out or growing your business, Yego SheCan is here to support you every step of the way.
        </p>
        <Link href="/register">
          <button className="btn-primary" style={{ marginTop: '2rem' }}>
            Get Started
          </button>
        </Link>
      </section>
    </div>
  )
}
