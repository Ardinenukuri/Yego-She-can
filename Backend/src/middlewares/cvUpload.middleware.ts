import multer from 'multer';
import { Request } from 'express';


const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed for CVs.'));
    }
};

export const cvUpload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } 
});