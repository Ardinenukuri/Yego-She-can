"use strict";
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
exports.default = RegisterPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
const link_1 = __importDefault(require("next/link"));
require("@/app/register/register.css");
function RegisterPage() {
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'Female',
        age: '',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleChange = (e) => {
        setFormData(Object.assign(Object.assign({}, formData), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            react_hot_toast_1.default.error("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            yield api_1.default.post('/api/auth/register', Object.assign(Object.assign({}, formData), { age: parseInt(formData.age) }));
            react_hot_toast_1.default.success('Registration successful! Please check your email to verify.');
            router.push('/auth/login');
        }
        catch (error) {
            const errorMessage = ((_d = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Registration failed';
            react_hot_toast_1.default.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join the Yego SheCan community</p>

        <div className="register-name-fields">
          <div className="register-input-group">
            <label htmlFor="firstName" className="register-label">First Name</label>
            <input id="firstName" name="firstName" type="text" className="register-input" required value={formData.firstName} onChange={handleChange}/>
          </div>
          <div className="register-input-group">
            <label htmlFor="lastName" className="register-label">Last Name</label>
            <input id="lastName" name="lastName" type="text" className="register-input" required value={formData.lastName} onChange={handleChange}/>
          </div>
        </div>
        
        <div className="register-input-group">
            <label htmlFor="username" className="register-label">Username</label>
            <input id="username" name="username" type="text" className="register-input" required value={formData.username} onChange={handleChange}/>
        </div>

        <div className="register-input-group">
            <label htmlFor="email" className="register-label">Email Address</label>
            <input id="email" name="email" type="email" className="register-input" required value={formData.email} onChange={handleChange}/>
        </div>

        <div className="register-input-group">
            <label htmlFor="password" className="register-label">Password</label>
            <input id="password" name="password" type="password" className="register-input" required value={formData.password} onChange={handleChange}/>
        </div>

        <div className="register-input-group">
            <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" className="register-input" required value={formData.confirmPassword} onChange={handleChange}/>
        </div>
        
        <div className="register-name-fields">
            <div className="register-input-group">
                <label htmlFor="age" className="register-label">Age</label>
                <input id="age" name="age" type="number" className="register-input" required value={formData.age} onChange={handleChange}/>
            </div>
            <div className="register-input-group">
                <label htmlFor="gender" className="register-label">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="register-input">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                </select>
            </div>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="register-footer">
          Already have an account?{' '}
          <link_1.default href="/login" className="register-link">
            Login
          </link_1.default>
        </p>
      </form>
    </div>);
}
