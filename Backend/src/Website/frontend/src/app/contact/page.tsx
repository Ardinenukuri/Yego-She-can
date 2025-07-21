// Your Contact.tsx component file
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import '../styles/Contact.css'; // Assuming your CSS is here

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending your message...');
    
    try {
      const response = await api.post('/api/auth/contact', form);
      
      toast.success(response.data.message || 'Message sent successfully!', { id: toastId });
      
      // Clear the form after successful submission
      setForm({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: '',
      });

    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
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
              <input type="text" name="name" placeholder="Full Name *" required value={form.name} onChange={handleChange} disabled={loading} />
              <input type="email" name="email" placeholder="Email Address *" required value={form.email} onChange={handleChange} disabled={loading} />
            </div>
            <input type="text" name="phone" placeholder="Phone Number (Optional)" value={form.phone} onChange={handleChange} disabled={loading} />
            <select name="category" required value={form.category} onChange={handleChange} disabled={loading}>
              <option value="">What can we help you with? *</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
            <textarea name="message" rows={4} placeholder="Your Message *" required value={form.message} onChange={handleChange} disabled={loading} />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>

        {/* Info Section (remains the same) */}
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