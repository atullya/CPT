import { Response } from 'express';
import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
  verifyRefreshToken,
  verifyTemporaryToken,
} from '../utils/jwt';
import { APIError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import { createResetToken } from '../utils/resetToken';
import { EmailService } from './email.service';
import { UserInput, UserUpdateSchema } from '../schemas/user.schema';
import { z } from 'zod';
import crypto from 'crypto';
import { UserStatus } from '../enums/userStatus.enum';
export class AuthService {
  static async register(data: UserInput) {
    if (!data.name || !data.email || !data.password) {
      throw new APIError('All fields are required!');
    }

    const existing = await User.findOne({ email: data.email });
    if (existing) throw new APIError('Email already in use');

    const hashed = await hashPassword(data.password);
    const user = await User.create({ ...data, password: hashed });
    return { id: user._id, email: user.email };
  }

  static async login(data: any) {
    if (!data.email || !data.password) {
      throw new APIError('All fields are required!');
    }

    const user = await User.findOne({ email: data.email });
    if (!user) throw new APIError('User not found');

    const valid = await comparePassword(data.password, user.password);
    if (!valid) throw new APIError('Invalid credentials');

    if (user.status === UserStatus.PENDING) {
      user.status = UserStatus.ACTIVE;
    }
    user.lastActive = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) throw new APIError('User not found');

    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) throw new APIError('Invalid current password');

    user.password = await hashPassword(newPassword);
    await user.save();
    return { message: 'Password changed successfully' };
  }

  static async resetPassword(token: string, tempPassword: string, newPassword: string) {
    if (!token) throw new APIError('Reset token is required');
    if (!tempPassword || !newPassword)
      throw new APIError('Temporary and new passwords are required');

    let decoded: JwtPayload;
    try {
      decoded = verifyTemporaryToken(token);
    } catch {
      throw new APIError('Invalid or expired token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) throw new APIError('User not found');

    const validTemp = await comparePassword(tempPassword, user.password);
    if (!validTemp) throw new APIError('Invalid temporary password');

    user.password = await hashPassword(newPassword);
    user.status = UserStatus.ACTIVE;
    await user.save();

    return { message: 'Password reset successfully' };
  }
  static async forgotPassword(email: string) {
    if (!email) throw new APIError('Email is required');

    const user = await User.findOne({ email });
    if (!user) throw new APIError('User not found', 404);

    const { rawToken, hashedToken } = createResetToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}newpassword?token=${rawToken}&id=${user._id}`;
    console.log('Reset URL:', resetUrl);

    try {
      await EmailService.sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new APIError('Failed to send reset email. Try again later.');
    }

    return { message: 'Password reset link sent to your email' };
  }

  static async deleteUser(id: string) {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw new APIError('User not found or unable to delete');
    return { message: 'User deleted successfully' };
  }
  static async updateUser(id: string, updateData: z.infer<typeof UserUpdateSchema>) {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw new APIError('User not found or unable to update');

    return updatedUser;
  }
  static async resetPasswordWithEmailToken(userId: string, rawToken: string, newPassword: string) {
    if (!userId || !rawToken || !newPassword) {
      throw new APIError('User id, token and new password are required', 400);
    }

    const user = await User.findById(userId).select(
      '+passwordResetToken +passwordResetExpires +password',
    );

    if (!user) throw new APIError('User not found', 404);

    if (!user.passwordResetToken || !user.passwordResetExpires) {
      throw new APIError('No password reset request found', 400);
    }

    if (user.passwordResetExpires.getTime() < Date.now()) {
      throw new APIError('Password reset token has expired', 400);
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    if (user.passwordResetToken !== hashedToken) {
      throw new APIError('Invalid password reset token', 400);
    }

    user.password = await hashPassword(newPassword);
    user.passwordResetToken = undefined as any;
    user.passwordResetExpires = undefined as any;

    await user.save();

    return { message: 'Password reset successfully' };
  }
  static async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new APIError('Refresh token is required', 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw err;
    }
    const user = await User.findById(decoded.userId);
    if (!user) throw new APIError('User not found', 404);

    user.lastActive = new Date();
    await user.save();

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
}
