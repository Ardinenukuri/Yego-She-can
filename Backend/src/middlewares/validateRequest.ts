import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export const validateRequest = (schema: ZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            res.status(400).json(error);
        }
    };