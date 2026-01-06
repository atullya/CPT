import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils/responseHandler';
import { APIError } from './errorHandler';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user) throw new APIError('User not found in request', 401);

  if (user.role !== 'admin' && user.role !== 'super-admin') {
    throw new APIError('Unauthorized access. Admins only.', 403);
  }

  next();
};
