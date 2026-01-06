import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env';
import { APIError } from '../middleware/errorHandler';
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const getJwtSecret = (): Secret => {
  if (!ENV.JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment');
  return ENV.JWT_SECRET as Secret;
};
export const generateAccessToken = (userId: string): string => {
  const secret = getJwtSecret();
  const options: SignOptions = {
    expiresIn: (ENV.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']) || '15m',
  };
  return jwt.sign({ userId }, secret, options);
};
export const generateToken = generateAccessToken;

export const generateRefreshToken = (userId: string): string => {
  const secret = getJwtSecret();
  const options: SignOptions = {
    expiresIn: (ENV.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) || '7d',
  };
  return jwt.sign({ userId }, secret, options);
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') throw new APIError('Refresh token expired', 401);
    throw new APIError('Invalid refresh token', 401);
  }
};
export const generateTemporaryToken = (
  userId: string,
  duration: string | number = '15m',
): string => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment');
  }

  const secret: Secret = ENV.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: duration as SignOptions['expiresIn'],
  };

  return jwt.sign({ userId }, secret, options);
};
export const verifyTemporaryToken = (token: string): JwtPayload => {
  if (!ENV.JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment');

  try {
    const secret: Secret = ENV.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') throw new APIError('Reset token expired');
    throw new APIError('Invalid reset token');
  }
};

export const verifyToken = (token: string) => {
  if (!ENV.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }
  return jwt.verify(token, ENV.JWT_SECRET as Secret);
};
