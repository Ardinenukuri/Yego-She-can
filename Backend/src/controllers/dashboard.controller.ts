import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/DashboardService';

export const DashboardController = {
    getDashboardData: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await DashboardService.getDashboardData();
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
};