"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed for CVs.'));
    }
};
exports.cvUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});
