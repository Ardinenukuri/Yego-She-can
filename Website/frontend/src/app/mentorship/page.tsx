'use client'

import React,{ useState } from 'react'
import Image from 'next/image'
import { FaUserCheck, FaCalendarAlt, FaHandsHelping } from 'react-icons/fa'
import './mentorship.css'
import heroImage from '../../../public/mentorship.jpg'

const MentorshipPage = () => {
    // const [form, setForm] = useState({
    //     name: '',
    //     email: '',
    //     mentor: '',
    //     date: '',
    //     time: '',
    //     message: '',
    // });

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setForm((prev) => ({ ...prev, [name]: value }));
    // };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     // Replace this with your backend POST request
    //     console.log('Submitted form:', form);

    //     alert('Your mentorship request has been submitted! We’ll be in touch soon.');
    //     setForm({
    //         name: '',
    //         email: '',
    //         mentor: '',
    //         date: '',
    //         time: '',
    //         message: '',
    //     });
    // };

    return (
        <main className="mentorship-page">
            <section className="hero">
                <div className="hero-overlay">
                    <div className="hero-text">
                        <h1>Find Your <span style={{ color: ' #7c34ab' }}>Mentor</span></h1>
                        <p>
                            Connect with successful women entrepreneurs who understand your journey. Get personalized
                            guidance, support, and advice to help you build and grow your business.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Book a Session</button>
                            <button className="btn-outline">Become a Mentor</button>
                        </div>
                    </div>
                </div>
                <Image src={heroImage} alt="Mentorship" className="hero-img" priority />
            </section>

            <section className="how-it-works">
                <h2>How Mentorship Works</h2>
                <div className="cards">
                    <div className="card">
                        <FaUserCheck className="card-icon" />
                        <h3>Choose Your Mentor</h3>
                        <p>
                            Browse our network of experienced women entrepreneurs and select a mentor whose expertise matches your needs.
                        </p>
                    </div>
                    <div className="card">
                        <FaCalendarAlt className="card-icon" />
                        <h3>Schedule Sessions</h3>
                        <p>
                            Book one-on-one sessions at times that work for both you and your mentor. Sessions are conducted via video call.
                        </p>
                    </div>
                    <div className="card">
                        <FaHandsHelping className="card-icon" />
                        <h3>Get Guidance</h3>
                        <p>
                            Receive personalized advice, feedback on your business plans, and ongoing support to help you succeed.
                        </p>
                    </div>
                </div>
            </section>

            <section className="why-mentorship">
                <h2>Why Choose Our Mentorship Program?</h2>
                <ul>
                    <li><strong>Completely Free:</strong> All mentorship sessions are provided at no cost as part of our commitment to supporting women entrepreneurs.</li>
                    <li><strong>Experienced Mentors:</strong> Our mentors are successful women entrepreneurs with real-world experience in various industries.</li>
                    <li><strong>Flexible Scheduling:</strong> Book sessions at times that work for your schedule, including evenings and weekends.</li>
                    <li><strong>Personalized Guidance:</strong> Get advice tailored to your specific business goals, challenges, and industry.</li>
                    <li><strong>Ongoing Support:</strong> Build long-term relationships with mentors who will support your journey over time.</li>
                    <li><strong>Network Access:</strong> Connect with other mentees and expand your professional network within our community.</li>
                </ul>
            </section>
      {/* // Add this section where you'd like the form to appear
            <section className="book-session-form-section">
                <h2>Book a Mentorship Session</h2>
                <form className="session-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name *"
                            required
                            value={form.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address *"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        name="mentor"
                        placeholder="Preferred Mentor (Optional)"
                        value={form.mentor}
                        onChange={handleChange}
                    />
                    <div className="form-group">
                        <input
                            type="date"
                            name="date"
                            required
                            value={form.date}
                            onChange={handleChange}
                        />
                        <input
                            type="time"
                            name="time"
                            required
                            value={form.time}
                            onChange={handleChange}
                        />
                    </div>
                    <textarea
                        name="message"
                        placeholder="What would you like to discuss?"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                    ></textarea>
                    <button type="submit">Submit Request</button>
                </form>
            </section> */}

        </main>
    )
}

export default MentorshipPage
