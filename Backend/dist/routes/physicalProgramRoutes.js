"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PhysicalProgramController_1 = require("../controllers/PhysicalProgramController");
const router = express_1.default.Router();
router.get('/public/next-physical-program', PhysicalProgramController_1.PhysicalProgramController.getUpcomingProgram);
exports.default = router;
