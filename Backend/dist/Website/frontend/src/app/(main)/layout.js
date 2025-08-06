"use strict";
// src/app/(main)/layout.tsx (New File)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainAppLayout;
const ClientLayout_1 = __importDefault(require("@/components/ClientLayout"));
function MainAppLayout({ children }) {
    // This layout wraps all your main pages with the ClientLayout,
    // giving them the Navbar and Footer.
    return (<main>
      <ClientLayout_1.default>{children}</ClientLayout_1.default>
    </main>);
}
