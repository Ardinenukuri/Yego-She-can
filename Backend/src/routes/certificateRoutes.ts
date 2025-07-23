import { Router, Request, Response, NextFunction } from 'express';
import { issueCertificate, getMyCertificates, generateCertificatePdfStream } from '../services/certificateService'; 
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';


interface IssueCertificateBody {
    learnerId: number;
    courseId: number;
}

const router = Router();


router.post(
    '/issue',
    protect, authorize('program manager'),
    async (req: Request<{}, {}, IssueCertificateBody>, res: Response) => {
        const { learnerId, courseId } = req.body;

        
        if (!learnerId || !courseId) {
            return res.status(400).json({ message: 'Learner ID and Course ID are required.' });
        }

        try {
            
            const certificate = await issueCertificate(learnerId, courseId);
            res.status(201).json(certificate);
        } catch (error: unknown) {
            console.error('Failed to issue certificate:', error);
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            res.status(500).json({ message: 'An unknown server error occurred.' });
        }
    }
);


router.get(
    '/my-certificates',
    protect, 
    async (req: Request, res: Response) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Authentication error, user not found.' });
        }
        
        try {
            const certificates = await getMyCertificates(req.user.id);
            res.json(certificates);
        } catch (error: unknown) {
            console.error('Failed to fetch certificates:', error);
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            res.status(500).json({ message: 'An unknown server error occurred.' });
        }
    }
);

router.post('/download', async (req: Request, res: Response) => {
    const { learnerName, courseName, issuedDate } = req.body;

    if (!learnerName || !courseName || !issuedDate) {
        return res.status(400).json({ message: 'Missing required certificate data.' });
    }

    try {
        await generateCertificatePdfStream(res, learnerName, courseName, issuedDate);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate certificate PDF.' });
        }
    }
});
export default router;