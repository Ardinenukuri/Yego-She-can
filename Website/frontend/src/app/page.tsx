'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'
import api from '@/lib/api' 

import {
  FaChalkboardTeacher,
  FaHandHoldingHeart,
  FaShoppingBasket,
} from 'react-icons/fa'
import { FiAward, FiUsers, FiTarget } from 'react-icons/fi'
import heroImage from '../../public/homepag.jpg'
import './home.css'


interface NextProgram {
  title: string;
  next_session: string; 
}

export default function Home() {
  const [countdown, setCountdown] = useState('')
  const [nextProgram, setNextProgram] = useState<NextProgram | null>(null)
  const [isLoadingCountdown, setIsLoadingCountdown] = useState(true)

  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

  
  useEffect(() => {
    const fetchNextProgram = async () => {
      try {
        setIsLoadingCountdown(true)
        const response = await api.get('/api/public/next-physical-program')
        setNextProgram(response.data)
      } catch (error) {
        console.error("Failed to fetch next program for countdown:", error)
        setNextProgram(null)
      } finally {
        setIsLoadingCountdown(false)
      }
    }
    fetchNextProgram()
  }, [])

  
  useEffect(() => {
    if (!nextProgram) {
      setCountdown('Check out our physical programs for upcoming dates!')
      return
    }

    const interval = setInterval(() => {
      const countdownDate = new Date(nextProgram.next_session).getTime()
      const now = new Date().getTime()
      const difference = countdownDate - now

      if (difference <= 0) {
        setCountdown(`Our ${nextProgram.title} program has started!`)
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown(
        `${days}d ${hours}h ${minutes}m ${seconds}s until our ${nextProgram.title} program`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [nextProgram]) 

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
            {/* Conditional Countdown Timer */}
            {!isLoadingCountdown && nextProgram && (
              <div className="countdown-timer">
                <strong>{countdown}</strong>
              </div>
            )}
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


      <section className="cta-section" data-aos="fade-up">
        <h2>Join Our Community Today</h2>
        <p>
          Whether you're just starting out or growing your business, Yego SheCan is here to support you every step of the way.
        </p>
        <Link href="/auth/register">
          <button className="btn-primary" style={{ marginTop: '2rem' }}>
            Get Started
          </button>
        </Link>

        {!isLoadingCountdown && nextProgram && (
          <div className="countdown-timers">
            <strong>{countdown}</strong>
            <br />
            <Link href="/services/physical">
              <button className="btn-primary" style={{ marginTop: '1rem' }}>
                Enroll Now
              </button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}