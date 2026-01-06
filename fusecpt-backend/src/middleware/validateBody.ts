import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { APIError } from './errorHandler';

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      throw new APIError(firstIssue.message, 400);
    }

    req.body = parsed.data;
    next();
  };
};
