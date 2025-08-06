"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'courseImage') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only images are allowed for the course image.'));
        }
    }
    else if (file.fieldname === 'resourceFile') {
        const allowedDocMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedDocMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed for the resource file.'));
        }
    }
    else {
        cb(null, false);
    }
};
exports.resourceUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 },
}).fields([
    { name: 'resourceFile', maxCount: 1 },
    { name: 'courseImage', maxCount: 1 },
]);
