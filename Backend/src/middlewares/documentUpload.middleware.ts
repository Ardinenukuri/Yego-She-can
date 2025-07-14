import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';


const uploadDir = 'uploads/resources';


fs.mkdirSync(uploadDir, { recursive: true });


const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `resource-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

export const documentUpload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 } 
});