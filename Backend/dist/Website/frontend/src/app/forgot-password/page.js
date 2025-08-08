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
exports.default = ForgotPasswordPage;
const react_1 = require("react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
const link_1 = __importDefault(require("next/link"));
require("./forgot-password.css");
function ForgotPasswordPage() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        const toastId = react_hot_toast_1.default.loading('Sending reset link...');
        try {
            yield api_1.default.post('/api/auth/forgot-password', { email });
            react_hot_toast_1.default.success('If an account with that email exists, a reset link has been sent.', {
                id: toastId,
            });
        }
        catch (error) {
            react_hot_toast_1.default.error('An error occurred. Please try again.', {
                id: toastId,
            });
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2 className="forgot-password-title">Forgot Your Password?</h2>
        <p className="forgot-password-subtitle">
          No worries! Enter your email below and we'll send you a link to reset it.
        </p>

        <div className="forgot-password-input-group">
            <label htmlFor="email" className="forgot-password-label">Email Address</label>
            <input id="email" name="email" type="email" className="forgot-password-input" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="forgot-password-footer">
          Remembered your password?{' '}
          <link_1.default href="/login" className="forgot-password-link">
            Back to Login
          </link_1.default>
        </p>
      </form>
    </div>);
}
