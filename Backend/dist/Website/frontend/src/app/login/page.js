"use strict";
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
exports.default = LoginPage;
const react_1 = require("react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const AuthContext_1 = require("@/contexts/AuthContext");
const api_1 = __importDefault(require("@/lib/api"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
require("./login.css");
function LoginPage() {
    const [formData, setFormData] = (0, react_1.useState)({ username: '', password: '' });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const { login } = (0, AuthContext_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    const handleChange = (e) => {
        setFormData(Object.assign(Object.assign({}, formData), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        setLoading(true);
        try {
            const response = yield api_1.default.post('/api/auth/login', formData);
            react_hot_toast_1.default.success('Login successful!');
            const user = response.data.user;
            login(response.data.token, user);
            if (user.role === 'program manager') {
                router.push('/dashboard');
            }
            else {
                router.push('/about');
            }
        }
        catch (error) {
            const errorMessage = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Login failed. Please check your credentials.';
            react_hot_toast_1.default.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your Yego SheCan account</p>

        <div className="login-input-group">
            <label htmlFor="username" className="login-label">Username</label>
            <input id="username" name="username" type="text" className="login-input" required value={formData.username} onChange={handleChange}/>
        </div>

        <div className="login-input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input id="password" name="password" type="password" className="login-input" required value={formData.password} onChange={handleChange}/>
        </div>

        <div className="login-options">
            <link_1.default href="/forgot-password" className="login-link">
                Forgot password?
            </link_1.default>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="login-footer">
          Don’t have an account?{' '}
          <link_1.default href="/register" className="login-link">
            Sign up
          </link_1.default>
        </p>
      </form>
    </div>);
}
