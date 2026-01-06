import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ENV } from '../config/env';
import { User } from '../models/user.model';
interface JwtPayloadCustom extends jwt.JwtPayload {
  userId: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token missing' });
  }
  try {
    const decodeToken = jwt.verify(token, ENV.JWT_SECRET) as JwtPayloadCustom;
    if (!decodeToken?.userId) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }
    const userDetail = await User.findById(decodeToken.userId);
    if (!userDetail) {
      return res.status(401).json({ message: 'Unauthorized - User not found' });
    }

    req.user = userDetail;
    userDetail.lastActive = new Date();
    await userDetail.save();

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' });
    }
    return res.status(403).json({ success: false, message: 'Invalid access token' });
  }
};
