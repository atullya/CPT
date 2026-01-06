import { Response } from 'express';

export const successResponse = (res: Response, status: number, data: any) => {
  return res.status(status).json({ success: true, data });
};

export const errorResponse = (res: Response, error: any) => {
  const message = error.message || 'Server Error';
  return res.status(400).json({ success: false, message });
};
