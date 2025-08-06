"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramManagerController = void 0;
const ProgramManagerService_1 = require("../services/ProgramManagerService");
const ReportService_1 = require("../services/ReportService");
exports.ProgramManagerController = {
    getApplications: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const applications = yield ProgramManagerService_1.ProgramManagerService.getPendingApplications();
            res.status(200).json(applications);
        }
        catch (error) {
            next(error);
        }
    }),
    processApplication: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const applicationId = parseInt(req.params.id, 10);
            const { decision } = req.body;
            const pmName = req.user.firstName;
            yield ProgramManagerService_1.ProgramManagerService.processApplication(applicationId, decision, pmName);
            res.status(200).json({ message: `Application has been ${decision}.` });
        }
        catch (error) {
            next(error);
        }
    }),
    createPhysicalProgram: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const creatorId = req.user.id;
            const program = yield ProgramManagerService_1.ProgramManagerService.createPhysicalProgram(req.body, creatorId, req.file);
            res.status(201).json({ message: 'Physical program created successfully.', program });
        }
        catch (error) {
            next(error);
        }
    }),
    exportDashboardPDF: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pmName = `${req.user.firstName} ${req.user.lastName}`;
            const pdfBuffer = yield ReportService_1.ReportService.generateAdminReportPDF(pmName);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="platform-report-${Date.now()}.pdf"`);
            res.send(pdfBuffer);
        }
        catch (error) {
            next(error);
        }
    }),
};
