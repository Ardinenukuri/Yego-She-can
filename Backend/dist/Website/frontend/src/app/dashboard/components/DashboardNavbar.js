"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const fa_1 = require("react-icons/fa");
require("./dashboardNavbar.css");
const DashboardNavbar = () => {
    const user = { name: 'Afua Hamissi' };
    return (<header className="dashboard-navbar">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-user">
        <fa_1.FaUserCircle className="user-icon"/>
        <span className="username">{user.name}</span>
      </div>
    </header>);
};
exports.default = DashboardNavbar;
