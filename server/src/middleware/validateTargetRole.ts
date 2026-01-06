import { Request, Response, NextFunction } from 'express';
import { APIError } from './errorHandler';

export const validateTargetRole = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;

  if (!role) {
    throw new APIError('Role is required in request body');
  }

  const allowedRoles = ['user', 'admin', 'super-admin'];
  if (!allowedRoles.includes(role)) {
    throw new APIError('Invalid role value. Allowed: super-admin,admin or user');
  }

  next();
};
