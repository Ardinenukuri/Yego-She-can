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
exports.default = ChangePasswordPage;
const react_1 = require("react");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const api_1 = __importDefault(require("@/lib/api"));
const Input_1 = __importDefault(require("@/components/ui/Input"));
const Button_1 = __importDefault(require("@/components/ui/Button"));
const navigation_1 = require("next/navigation");
function ChangePasswordPage() {
    const [formData, setFormData] = (0, react_1.useState)({
        previousPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleChange = (e) => {
        setFormData(Object.assign(Object.assign({}, formData), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            react_hot_toast_1.default.error("New passwords don't match.");
            return;
        }
        setLoading(true);
        try {
            const response = yield api_1.default.put('/api/auth/change-password', {
                previousPassword: formData.previousPassword,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmNewPassword,
            });
            react_hot_toast_1.default.success(response.data.message || 'Password changed successfully!');
            router.push('/dashboard/profile');
        }
        catch (error) {
            console.error("Change password failed. Full error:", error.response);
            const errorMessage = ((_d = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) ||
                ((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) ||
                'An unknown error occurred.';
            react_hot_toast_1.default.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Change Your Password</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Enter your old password and a new password to update your account.
        </p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <Input_1.default label="Current Password" name="previousPassword" type="password" required value={formData.previousPassword} onChange={handleChange}/>
          <Input_1.default label="New Password" name="newPassword" type="password" required value={formData.newPassword} onChange={handleChange}/>
          <Input_1.default label="Confirm New Password" name="confirmNewPassword" type="password" required value={formData.confirmNewPassword} onChange={handleChange}/>
          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end">
              <Button_1.default type="submit" isLoading={loading}>
                Update Password
              </Button_1.default>
            </div>
          </div>
        </form>
      </div>
    </div>);
}
