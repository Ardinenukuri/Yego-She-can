"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const react_1 = __importStar(require("react"));
const image_1 = __importDefault(require("next/image"));
const lucide_react_1 = require("lucide-react");
const fa_1 = require("react-icons/fa");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
require("./mentorship.css");
const mentorship_jpg_1 = __importDefault(require("../../../public/mentorship.jpg"));
const MentorshipPage = () => {
    const [form, setForm] = (0, react_1.useState)({
        name: '',
        email: '',
        expertise: '',
        message: '',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleChange = (e) => {
        setForm(Object.assign(Object.assign({}, form), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        e.preventDefault();
        setLoading(true);
        const toastId = react_hot_toast_1.default.loading('Submitting your application...');
        try {
            const response = yield api_1.default.post('/api/auth/apply-mentor', form);
            react_hot_toast_1.default.success(response.data.message || 'Application submitted successfully!', { id: toastId });
            setForm({
                name: '',
                email: '',
                expertise: '',
                message: '',
            });
        }
        catch (error) {
            const errorMessage = ((_d = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Submission failed. Please try again.';
            react_hot_toast_1.default.error(errorMessage, { id: toastId });
        }
        finally {
            setLoading(false);
        }
    });
    return (<main className="mentorship-page">
            <section className="hero">
                <image_1.default src={mentorship_jpg_1.default} alt="Mentorship" className="hero-img" priority/>
                <div className="hero-overlay">
                    <div className="hero-text">
                        <h1>
                            Find Your <span className="highlight">Mentor</span>
                        </h1>
                        <p>
                            Connect with successful women entrepreneurs who understand your journey.
                            Get personalized guidance, support, and advice to help you grow your business.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={() => {
            var _a;
            (_a = document.getElementById('become-mentor-form')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
        }}>
                                Book a Session
                            </button>
                            <button className="btn-outline" onClick={() => {
            var _a;
            (_a = document.getElementById('become-mentor-form')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
        }}>
                                Become a Mentor
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How Mentorship Works</h2>
                <div className="cards">
                    <div className="card">
                        <fa_1.FaUserCheck className="card-icon"/>
                        <h3>Choose Your Mentor</h3>
                        <p>
                            Browse our network of experienced women entrepreneurs and select a mentor whose expertise matches your needs.
                        </p>
                    </div>
                    <div className="card">
                        <fa_1.FaCalendarAlt className="card-icon"/>
                        <h3>Schedule Sessions</h3>
                        <p>
                            Book one-on-one sessions at times that work for both you and your mentor. Sessions are conducted via video call.
                        </p>
                    </div>
                    <div className="card">
                        <fa_1.FaHandsHelping className="card-icon"/>
                        <h3>Get Guidance</h3>
                        <p>
                            Receive personalized advice, feedback on your business plans, and ongoing support to help you succeed.
                        </p>
                    </div>
                </div>
            </section>

            <section className="why-mentorship">
                <h2>Why Choose Our Mentorship Program?</h2>
                <div className="why-columns">
                    <div className="why-column">
                        <ul>
                            <li><lucide_react_1.CheckCircle /> <strong style={{ fontSize: '1rem' }}>Completely Free:</strong> All sessions are free as part of our commitment to support.</li>
                            <li><lucide_react_1.CheckCircle /> <strong style={{ fontSize: '1rem' }}>Experienced Mentors:</strong> Real-world experts across industries.</li>
                            <li><lucide_react_1.CheckCircle /> <strong style={{ fontSize: '1rem' }}>Flexible Scheduling:</strong> Sessions available evenings and weekends.</li>
                        </ul>
                    </div>
                    <div className="why-column">
                        <ul>
                            <li><lucide_react_1.CheckCircle /> <strong style={{ fontSize: '1rem' }}>Personalized Guidance:</strong> Tailored advice for your business challenges.</li>
                            <li><lucide_react_1.CheckCircle /> <strong style={{ fontSize: '1rem' }}>Ongoing Support:</strong> Build long-term mentor relationships.</li>
                            <li><lucide_react_1.CheckCircle /> <strong style={{ fontSize: '1rem' }}>Network Access:</strong> Connect with a strong women-led business community.</li>
                        </ul>
                    </div>
                </div>
            </section>

        
            <section className="book-session-form-section" id="become-mentor-form">
                <h2>Request to Become a Mentor</h2>
                <form className="session-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name" placeholder="Full Name *" required value={form.name} onChange={handleChange} disabled={loading}/>
                        <input type="email" name="email" placeholder="Email Address *" required value={form.email} onChange={handleChange} disabled={loading}/>
                    </div>
                    <input type="text" name="expertise" placeholder="Your Field of Expertise *" required value={form.expertise} onChange={handleChange} disabled={loading}/>
                    <textarea name="message" placeholder="Tell us why you want to be a mentor *" rows={4} required value={form.message} onChange={handleChange} disabled={loading}></textarea>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </section>
        </main>);
};
exports.default = MentorshipPage;
