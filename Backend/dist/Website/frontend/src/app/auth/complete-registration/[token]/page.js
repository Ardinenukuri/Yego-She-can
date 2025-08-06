"use strict";
// src/app/auth/complete-registration/[token]/page.tsx
"use client";
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
exports.default = CompleteRegistrationPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
const link_1 = __importDefault(require("next/link"));
require("../complete-registration.css"); // Import CSS from the parent directory
function CompleteRegistrationPage() {
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const params = (0, navigation_1.useParams)();
    const token = params.token; // Get the token from the URL
    const handleChange = (e) => {
        setFormData(Object.assign(Object.assign({}, formData), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            react_hot_toast_1.default.error("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            yield api_1.default.put(`/api/auth/complete-registration/${token}`, formData);
            react_hot_toast_1.default.success('Registration completed successfully! You can now log in.');
            router.push('/login');
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Registration failed. The link may be invalid or expired.';
            react_hot_toast_1.default.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="complete-registration-container">
      <form className="complete-registration-form" onSubmit={handleSubmit}>
        <h2 className="complete-registration-title">Complete Your Account</h2>
        <p className="complete-registration-subtitle">
          Welcome to Yego SheCan! Set up your mentor profile.
        </p>

        <div className="complete-registration-input-group">
          <label htmlFor="firstName" className="complete-registration-label">First Name</label>
          <input id="firstName" name="firstName" type="text" className="complete-registration-input" required value={formData.firstName} onChange={handleChange}/>
        </div>
        
        <div className="complete-registration-input-group">
          <label htmlFor="lastName" className="complete-registration-label">Last Name</label>
          <input id="lastName" name="lastName" type="text" className="complete-registration-input" required value={formData.lastName} onChange={handleChange}/>
        </div>

        <div className="complete-registration-input-group">
          <label htmlFor="username" className="complete-registration-label">Username</label>
          <input id="username" name="username" type="text" className="complete-registration-input" required value={formData.username} onChange={handleChange}/>
        </div>
        
        <div className="complete-registration-input-group">
          <label htmlFor="password" className="complete-registration-label">Password</label>
          <input id="password" name="password" type="password" className="complete-registration-input" required value={formData.password} onChange={handleChange}/>
        </div>
        
        <div className="complete-registration-input-group">
          <label htmlFor="confirmPassword" className="complete-registration-label">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="complete-registration-input" required value={formData.confirmPassword} onChange={handleChange}/>
        </div>

        <button type="submit" className="complete-registration-button" disabled={loading}>
          {loading ? 'Completing...' : 'Complete Registration'}
        </button>
        
        <p className="complete-registration-footer">
          Received this in error?{' '}
          <link_1.default href="/login" className="complete-registration-link">
            Back to Login
          </link_1.default>
        </p>
      </form>
    </div>);
}
