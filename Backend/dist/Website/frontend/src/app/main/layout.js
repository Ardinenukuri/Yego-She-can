"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainLayout;
const Navbar_1 = __importDefault(require("@/components/Navbar"));
const footer_1 = __importDefault(require("@/components/footer"));
function MainLayout({ children }) {
    return (<>
      <Navbar_1.default />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <footer_1.default />
    </>);
}
