import { Request, Response, NextFunction } from 'express';
import { PhysicalProgramService } from '../services/PhysicalProgramService';

export const PhysicalProgramController = {

  getUpcomingProgram: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const program = await PhysicalProgramService.getNextUpcomingProgram();
      res.json(program);
    } catch (error) {
      next(error);
    }
  },
};