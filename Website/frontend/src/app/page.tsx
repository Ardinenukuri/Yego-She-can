'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaChalkboardTeacher, FaHandHoldingHeart, FaShoppingBasket } from 'react-icons/fa'
import { FiAward, FiUsers, FiTarget } from 'react-icons/fi'
import heroImage from '../../public/home.jpg'
import './home.css'
import '../app/about/about.css'
export default function Home() {
  const values = [
    {
      icon: <FiAward />,
      title: 'Excellence',
      description:
        ' We maintain the highest standards in our curriculum, instruction, and support services.',
    },
    {
      icon: < FiUsers />,
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
    <div className="home-page">
      <section className="hero">
        <Image
          src={heroImage}
          alt="Empowered woman with laptop"
          className="hero-image"
          priority
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Empowering Women, <span className="highlight">One Skill</span> at a Time
            </h1>
            <p>
              Yego SheCan uplifts women entrepreneurs through mentorship, business training, and digital access to markets.
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

      {/* About Section */}
      <section className="about-section">
        <h2>What We Do</h2>
        <p>
          We help women launch and grow businesses with access to expert guidance, free courses, and product sales platforms.
        </p>
      </section>

      {/* Services with Icons */}
      <section className="features-section">
        <div className="feature-card">
          <FaChalkboardTeacher className="feature-icon" />
          <h3>Entrepreneurship Training</h3>
          <p>Take courses in Sales, Marketing, Design Thinking, and Accounting tailored for women entrepreneurs.</p>
        </div>
        <div className="feature-card">
          <FaHandHoldingHeart className="feature-icon" />
          <h3>Mentorship</h3>
          <p>Get matched with women leaders ready to guide, inspire, and support your entrepreneurial journey.</p>
        </div>
        <div className="feature-card">
          <FaShoppingBasket className="feature-icon" />
          <h3>E-commerce Access</h3>
          <p>Sell your handmade products like soaps and coffee to a supportive digital audience.</p>
        </div>
      </section>
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
      {/* CTA */}
      <section className="cta-section">
        <h2>Join Our Community Today</h2>
        <p>
          Sign up and access free resources, mentorship, and opportunities designed to empower you.
        </p>
        <Link href="/register">
          <button className="btn-outline" style={{ marginTop: '2rem' }}>Get Started</button>
        </Link>
      </section>
    </div>
  )
}
