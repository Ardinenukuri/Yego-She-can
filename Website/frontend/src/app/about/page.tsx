
'use client'

import Image from 'next/image'
import aboutImg from '../../../public/about.jpg'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './about.css'
import { FaBullseye, FaEye } from 'react-icons/fa'
import { FaUsers, FaHeart } from 'react-icons/fa'
import { FaBookOpen } from 'react-icons/fa'
import { FiAward, FiUsers, FiTarget } from 'react-icons/fi'

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])
  const values = [
    {
      icon: <FiAward />,
      title: 'Excellence',
      description:
        ' We maintain the highest standards in our curriculum, instruction, and support services.',
    },
    {
      icon: < FiUsers/>,
      title: 'Community',
      description:
       ' We foster a supportive environment where women lift each other up and celebrate shared success.',
    },
    {
      icon: <FiTarget />,
      title: 'Accessibility',
      description:
        'We remove barriers to education by making our programs affordable and accessible to all.',
    },
  ]
  return (
    <div className="about-container">
      <section className="hero-section" data-aos="fade-up">
        <div className="hero-image-wrapper">
          <Image
            src={aboutImg}
            alt="Empowering Women"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-overlay" />
          <div className="hero-text">
            <h1>We believe every woman deserves the opportunity</h1>
            <p>
              To build a sustainable business and secure her financial future,
              regardless of her background or circumstances.
            </p>
          </div>
        </div>
      </section>
<div className="cards">
      <section className="card-section" data-aos="fade-up">
        <div className="info-card">
          <div className="card-icon">
            <FaBullseye />
          </div>
          <h2>Our Mission</h2>
          <p>
            To provide comprehensive entrepreneurship education, practical skills
            training, and ongoing mentorship to underserved women, enabling them
            to start and grow successful businesses that transform their lives
            and communities.
          </p>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <FaEye />
          </div>
          <h2>Our Vision</h2>
          <p>
            A world where every woman has the knowledge, skills, and support
            needed to achieve economic independence through entrepreneurship,
            creating a ripple effect of positive change in families and
            communities worldwide.
          </p>
        </div>
      </section>
      <section className="card-section" data-aos="fade-right">
        <div className="info-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <h2>Who We Serve</h2>
          <ul className="card-list">
            <li>Underserved women aged 30 and above</li>
            <li>Women seeking economic independence</li>
            <li>Aspiring entrepreneurs with limited resources</li>
            <li>Women looking to develop practical business skills</li>
          </ul>
        </div>

        <div className="info-card" data-aos="fade-left">
          <div className="card-icon">
            <FaHeart />
          </div>
          <h2>Why We Focus on Women 30+</h2>
          <ul className="card-list">
            <li>Life experience brings valuable perspective</li>
            <li>Strong motivation for financial stability</li>
            <li>Commitment to long-term success</li>
            <li>Desire to create positive family impact</li>
          </ul>
        </div>
      </section>
</div>
           <section className="section card-section" data-aos="fade-up">
        <div className="card-icon">
          {/* <FaBookOpen /> */}
        </div>
        <div className="card-content">
          <h2>Our Story</h2>
          <p>
            Yego SheCan was founded on the belief that every woman has the power to create her own success story. Recognizing the challenges underserved women face in accessing education and resources, we set out to build a platform that combines practical training, mentorship, and community support to unlock their entrepreneurial potential.
          </p>
          <p>
            What began as a small local initiative with passionate mentors and community leaders has grown into a vibrant movement empowering women across Rwanda. Our programs focus on hands-on skills and real business challenges to prepare participants for lasting success.
          </p>
          <p>
            Today, Yego SheCan proudly stands as a beacon of hope and opportunity, having supported hundreds of women to start and grow thriving businesses that transform families and communities.
          </p>
        </div>
      </section>

      <section className="section values" data-aos="fade-up">
      <h2>Our Values</h2>
      <div className="values-cards">
        {values.map(({ icon, title, description }) => (
          <div key={title} className="value-card">
            <div className="card-icon-wrapper">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="team-section" data-aos="fade-up">
  <h2 className="team-title">Our Team</h2>
  <div className="team-grid">
    {[
      { name: "Yeetah", role: "Founder & CEO" },
      { name: "Ardine NUKURI", role: " Backend Developer" },
      { name: "Afua HAMISSI", role: "UI&UX Designer / Mobile Developer" },
      { name: " Diane Imgabire", role: "UI&UX Designer/  Mobile Developer" },
      { name: "Blandine MUNEZERO", role: "UI&UX Designer" },
      { name: "Moreen IRABA", role: "UI&UX Designer" }
    ].map((member, index) => (
      <div key={index} className="team-card">
        <div className="team-image-placeholder">Photo</div>
        <h3 className="team-name">{member.name}</h3>
        <p className="team-role">{member.role}</p>
        <p className="team-desc">
          Passionate about empowering women and building strong community-driven programs.
        </p>
      </div>
    ))}
  </div>
</section>

    </div>
  )
} 
