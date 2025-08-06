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
exports.default = ResetPasswordPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
const link_1 = __importDefault(require("next/link"));
require("../reset-password.css");
function ResetPasswordPage() {
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const params = (0, navigation_1.useParams)();
    const token = params.token;
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        e.preventDefault();
        if (password !== confirmPassword) {
            react_hot_toast_1.default.error("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            yield api_1.default.put(`/api/auth/reset-password/${token}`, {
                newPassword: password,
                confirmNewPassword: confirmPassword
            });
            react_hot_toast_1.default.success('Password reset successfully! You can now log in.');
            router.push('/auth/login');
        }
        catch (error) {
            const errorMessage = ((_d = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Password reset failed.';
            react_hot_toast_1.default.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2 className="reset-password-title">Set a New Password</h2>
        <p className="reset-password-subtitle">
          Please enter and confirm your new password below.
        </p>

        <div className="reset-password-input-group">
          <label htmlFor="password" className="reset-password-label">New Password</label>
          <input id="password" name="password" type="password" className="reset-password-input" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <div className="reset-password-input-group">
          <label htmlFor="confirmPassword" className="reset-password-label">Confirm New Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="reset-password-input" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>

        <button type="submit" className="reset-password-button" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        
        <p className="reset-password-footer">
          <link_1.default href="/login" className="reset-password-link">
            Back to Login
          </link_1.default>
        </p>
      </form>
    </div>);
}
