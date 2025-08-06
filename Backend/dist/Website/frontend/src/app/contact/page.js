"use strict";
// Your Contact.tsx component file
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
require("../styles/Contact.css"); // Assuming your CSS is here
const Contact = () => {
    const [form, setForm] = (0, react_1.useState)({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: '',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        e.preventDefault();
        setLoading(true);
        const toastId = react_hot_toast_1.default.loading('Sending your message...');
        try {
            const response = yield api_1.default.post('/api/auth/contact', form);
            react_hot_toast_1.default.success(response.data.message || 'Message sent successfully!', { id: toastId });
            // Clear the form after successful submission
            setForm({
                name: '',
                email: '',
                phone: '',
                category: '',
                message: '',
            });
        }
        catch (error) {
            const errorMessage = ((_d = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Failed to send message. Please try again.';
            react_hot_toast_1.default.error(errorMessage, { id: toastId });
        }
        finally {
            setLoading(false);
        }
    });
    return (<section className="contact-section-wrapper">
      <div className="contact-header">
        <h2>Get in <span className="highlight">Touch</span></h2>
        <p>Have questions about our programs? Need support? Want to partner with us? We're here to help and would love to hear from you.</p>
      </div>

      <div className="contact-content">
        {/* Form Section */}
        <div className="contact-form-card">
          <h3><lucide_react_1.MessageCircle className="icon"/> Send us a Message</h3>
          <p className="form-subtext">Fill out the form below and we'll get back to you within 24 hours</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input type="text" name="name" placeholder="Full Name *" required value={form.name} onChange={handleChange} disabled={loading}/>
              <input type="email" name="email" placeholder="Email Address *" required value={form.email} onChange={handleChange} disabled={loading}/>
            </div>
            <input type="text" name="phone" placeholder="Phone Number (Optional)" value={form.phone} onChange={handleChange} disabled={loading}/>
            <select name="category" required value={form.category} onChange={handleChange} disabled={loading}>
              <option value="">What can we help you with? *</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
            <textarea name="message" rows={4} placeholder="Your Message *" required value={form.message} onChange={handleChange} disabled={loading}/>
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
              <lucide_react_1.Mail className="icon"/>
              <div>
                <p className="info-title">Email</p>
                <p>info@YegoSheCan.org</p>
              </div>
            </div>

            <div className="info-item">
              <lucide_react_1.Phone className="icon"/>
              <div>
                <p className="info-title">Phone</p>
                <p>+250 782 742 723</p>
              </div>
            </div>

            <div className="info-item">
              <lucide_react_1.MapPin className="icon"/>
              <div>
                <p className="info-title">Address</p>
                <p>Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    </section>);
};
exports.default = Contact;
