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
exports.default = LoginPage;
const react_1 = require("react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const AuthContext_1 = require("@/contexts/AuthContext");
const api_1 = __importDefault(require("@/lib/api"));
const Input_1 = __importDefault(require("@/components/ui/Input"));
const Button_1 = __importDefault(require("@/components/ui/Button"));
const link_1 = __importDefault(require("next/link"));
function LoginPage() {
    const [formData, setFormData] = (0, react_1.useState)({ username: '', password: '' });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const { login } = (0, AuthContext_1.useAuth)();
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
            login(response.data.token, response.data.user);
        }
        catch (error) {
            react_hot_toast_1.default.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Login failed');
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input_1.default label="Username" name="username" type="text" required value={formData.username} onChange={handleChange}/>
            <Input_1.default label="Password" name="password" type="password" required value={formData.password} onChange={handleChange}/>
            <div className="text-sm">
                <link_1.default href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                </link_1.default>
            </div>
            <Button_1.default type="submit" isLoading={loading}>Sign in</Button_1.default>
          </form>
        </div>
      </div>
    </div>);
}
