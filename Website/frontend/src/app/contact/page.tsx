'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import '../styles/Contact.css';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert('Message submitted!');
  };

  return (
    <section className="contact-section-wrapper">
      <div className="contact-header">
        <h2>Get in <span className="highlight">Touch</span></h2>
        <p>Have questions about our programs? Need support? Want to partner with us? We're here to help and would love to hear from you.</p>
      </div>

      <div className="contact-content">
        {/* Form Section */}
        <div className="contact-form-card">
          <h3><MessageCircle className="icon" /> Send us a Message</h3>
          <p className="form-subtext">Fill out the form below and we'll get back to you within 24 hours</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input type="text" name="name" placeholder="Full Name *" required value={form.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email Address *" required value={form.email} onChange={handleChange} />
            </div>
            <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
            <select name="category" required value={form.category} onChange={handleChange}>
              <option value="">What can we help you with? *</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
            <textarea name="message" rows={4} placeholder="Your Message" value={form.message} onChange={handleChange} />
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Info Section */}
        <div className="contact-info-card">
          <h3>Contact Information</h3>
          <p className="form-subtext">Reach out to us through any of these channels</p>

          <div className="contact-info-group">
            <div className="info-item">
              <Mail className="icon" />
              <div>
                <p className="info-title">Email</p>
                <p>info@YegoSheCan.org</p>
              </div>
            </div>

            <div className="info-item">
              <Phone className="icon" />
              <div>
                <p className="info-title">Phone</p>
                <p>+250 782 742 723</p>
              </div>
            </div>

            <div className="info-item">
              <MapPin className="icon" />
              <div>
                <p className="info-title">Address</p>
                <p>Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
