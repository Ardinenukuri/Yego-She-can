"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programManager_controller_1 = require("../controllers/programManager.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const multer_1 = __importDefault(require("multer"));
const programImageUpload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, (0, authorize_middleware_1.authorize)('program manager'));
router.get('/applications', programManager_controller_1.ProgramManagerController.getApplications);
router.put('/applications/:id/process', programManager_controller_1.ProgramManagerController.processApplication);
router.post('/physical-programs', programImageUpload.single('image'), programManager_controller_1.ProgramManagerController.createPhysicalProgram);
router.get('/dashboard/export-pdf', programManager_controller_1.ProgramManagerController.exportDashboardPDF);
exports.default = router;
