'use client';
// import Contact from "@/components/ContactForm";
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
    <section>
      {/* Header */}
      <div className="contact-section">
        <h2>
          Get in <span className="text-pink-600">Touch</span>
        </h2>
        <p>
          Have questions about our programs? Need support? Want to partner with us?
          We're here to help and would love to hear from you.
        </p>
      </div>

      {/* Contact Section */}
      <div className="contact-wrapper">
        {/* Message Form */}
        <div className="contact-card ">
          <h3 >
            <MessageCircle className="text-pink-600" /> Send us a Message
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            Fill out the form below and we'll get back to you within 24 hours
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="grid md:grid-cols-2 gap-4">
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
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
             
            />
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              
            >
              <option value="">What can we help you with? *</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
            <textarea
              name="message"
              rows={4}
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
             
            />
            <button
              type="submit"
            
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Contact Information</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Reach out to us through any of these channels
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-4">
              <Mail className="text-pink-600 mt-1" />
              <div>
                <p className="font-medium">Email</p>
                <p>info@empowerher.org</p>
                <p>support@empowerher.org</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-pink-600 mt-1" />
              <div>
                <p className="font-medium">Phone</p>
                <p>+1 (555) 123-4567</p>
                <p>Monday – Friday, 9 AM – 6 PM EST</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="text-pink-600 mt-1" />
              <div>
                <p className="font-medium">Address</p>
                <p>123 Empowerment Street<br />Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
