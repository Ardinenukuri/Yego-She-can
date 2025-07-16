
'use client'

import Image from 'next/image'
import aboutImg from '../../../public/2148761757.jpg'
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
            <FaBullseye /> <h2>Our Mission</h2>
          </div>
         
          <p>
            To provide comprehensive entrepreneurship education, practical skills
            training, and ongoing mentorship to underserved women, enabling them
            to start and grow successful businesses that transform their lives
            and communities.
          </p>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <FaEye /><h2>Our Vision</h2>
          </div>
          
          <p>
            A world where every woman has the knowledge, skills, and support
            needed to achieve economic independence through entrepreneurship,
            creating a ripple effect of positive change in families and
            communities worldwide.
          </p>
        </div>
      </section>
      <section className="card-section" data-aos="fade-right">
        <div className="info-cards">
          <div className="card-icon">
            <FaUsers />  <h2>Who We Serve</h2>
          </div>
        
          <ul className="card-list">
            <li>Underserved women aged 30 and below</li>
            <li>Women seeking economic independence</li>
            <li>Aspiring entrepreneurs with limited resources</li>
            <li>Women looking to develop practical business skills</li>
          </ul>
        </div>

        <div className="info-cards" data-aos="fade-left">
          <div className="card-icon">
            <FaHeart />  <h2>Why We Focus on Women 30-</h2>
          </div>
          <ul className="card-list">
            <li>Life experience brings valuable perspective</li>
            <li>Strong motivation for financial stability</li>
            <li>Commitment to long-term success</li>
            <li>Desire to create positive family impact</li>
          </ul>
        </div>
      </section>
</div>
<section className="story-section">
  <div className="story-container">
    <h2 className="story-title">Our Story</h2>
    <div className="story-content">
      <p>
        <strong>Yego SheCan</strong> was founded on the belief that every woman, regardless of background,
        has the power to create her own success story. Born out of a deep desire to bridge the gap in
        education and economic opportunities for underserved women, our journey began with a simple but
        powerful mission: <em>to ignite entrepreneurial spirit through access to skills, mentorship, and a strong support system.</em>
      </p>

      <p>
        In our early days, we started with a small group of passionate mentors and a handful of courageous
        women eager to learn. With limited resources but unlimited determination, we hosted community
        workshops, practical business classes, and storytelling sessions to build confidence and
        cultivate business mindsets. These gatherings became a safe space where ideas could flourish and
        futures could be reimagined.
      </p>

      <p>
        As word spread and more women joined our mission, Yego SheCan evolved into a full-scale
        movement. We launched structured programs focused on real-world entrepreneurship — from
        accounting and marketing to product development and customer care. We introduced <strong>soap and coffee production </strong>
        as practical business ventures women could launch with minimal capital but maximum impact.
      </p>

      <p>
        What truly sets us apart is our <strong>mentorship ecosystem</strong>. We believe learning doesn’t stop in the
        classroom — it thrives in relationships. Our mentors walk alongside each learner, offering
        guidance, encouragement, and real-world advice that empowers women to turn knowledge into action.
      </p>

      <p>
        Over time, our reach extended beyond city borders into rural communities. Through mobile programs
        and digital learning, we’ve empowered women who previously had no access to such training. Many
        of these women have gone on to build successful businesses, employ others, and become role models
        in their communities.
      </p>

      <p>
        <em>
          Today, Yego SheCan is more than a training initiative — it's a beacon of transformation. We’ve
          helped hundreds of women rewrite their narratives, achieve financial independence, and uplift
          their families. Our story is still being written — one woman, one business, one breakthrough at
          a time.
        </em>
      </p>
    </div>
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
