"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
const ClientLayout_1 = __importDefault(require("@/components/ClientLayout"));
const AuthContext_1 = require("@/contexts/AuthContext");
const react_hot_toast_1 = require("react-hot-toast");
exports.metadata = {
    title: 'Yego SheCan',
    description: 'Empowering underserved women through entrepreneurship and e-learning.',
};
function RootLayout({ children }) {
    return (<html lang="en">
      <body>
        
        <AuthContext_1.AuthProvider>

          <react_hot_toast_1.Toaster position="top-right"/>
          <main>
            <ClientLayout_1.default>{children}</ClientLayout_1.default>
          </main>
        </AuthContext_1.AuthProvider>
      </body>
    </html>);
}
