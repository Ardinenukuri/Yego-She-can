import multer from 'multer';
import { Request } from 'express';


const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'courseImage') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed for the course image.'));
        }
    } 
    else if (file.fieldname === 'resourceFile') {
        const allowedDocMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedDocMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed for the resource file.'));
        }
    } 
    else {
        cb(null, false);
    }
};


export const resourceUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, 
}).fields([
  { name: 'resourceFile', maxCount: 1 },
  { name: 'courseImage', maxCount: 1 },
]);