import { Request, Response, NextFunction } from 'express';
import { ProgramManagerService } from '../services/ProgramManagerService';



export const ProgramManagerController = {
    getApplications: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applications = await ProgramManagerService.getPendingApplications();
            res.status(200).json(applications);
        } catch (error) { next(error); }
    },
    processApplication: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applicationId = parseInt(req.params.id, 10);
            const { decision } = req.body;
            const pmName = (req as any).user.firstName; 
            await ProgramManagerService.processApplication(applicationId, decision, pmName);
            res.status(200).json({ message: `Application has been ${decision}.` });
        } catch (error) { next(error); }
    },

    createPhysicalProgram: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const creatorId = (req as any).user.id;
            const program = await ProgramManagerService.createPhysicalProgram(req.body, creatorId, req.file);
            res.status(201).json({ message: 'Physical program created successfully.', program });
        } catch (error) { next(error); }
    },
};