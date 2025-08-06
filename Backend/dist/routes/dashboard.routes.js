"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.protect, (0, authorize_middleware_1.authorize)('program manager'), dashboard_controller_1.DashboardController.getDashboardData);
exports.default = router;
