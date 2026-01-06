import { ENV } from '../config/env';
import { APIError } from '../middleware/errorHandler';
import { User } from '../models/user.model';
import { hashPassword } from '../utils/bcrypt';
import crypto from 'crypto';
import { generateTemporaryToken } from '../utils/jwt';

import {
  adminInviteTemplate,
  superAdminInviteTemplate,
  userInviteTemplate,
} from '../utils/emailHelper';
import { EmailService } from './email.service';
import { UserInput } from '../schemas/user.schema';

export class SuperAdminService {
  static async createUser(data: UserInput, currentUserId: string) {
    if (!data.name || !data.email || !data.role) {
      throw new APIError('Name, email, and role are required');
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) throw new APIError('Current user not found');

    if (data.role === 'super-admin' && currentUser.role !== 'super-admin') {
      throw new APIError('Only Super Admins can invite another Super Admin');
    }

    const existing = await User.findOne({ email: data.email });
    if (existing) throw new APIError('Email already in use');

    const tempPassword = crypto.randomBytes(5).toString('hex');
    const hashed = await hashPassword(tempPassword);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
      createdBy: currentUserId,
    });

    const minutes = ENV.RESET_TOKEN_EXPIRY_MINUTES;
    const token = generateTemporaryToken(user._id.toString(), `${minutes}m`);
    const expiry = new Date(Date.now() + minutes * 60 * 1000).toLocaleString();
    const appUrl = ENV.FRONTEND_URL;
    const resetLink = `${appUrl.replace(/\/$/, '')}/changePassword?token=${encodeURIComponent(token)}`;

    let emailHtml = '';
    let subject = '';

    switch (data.role) {
      case 'super-admin':
        emailHtml = superAdminInviteTemplate(user.name, resetLink, tempPassword, expiry);
        subject = 'Super Admin Invitation – Set Your Password';
        break;
      case 'admin':
        emailHtml = adminInviteTemplate(user.name, resetLink, tempPassword, expiry);
        subject = 'Admin Invitation – Set Your Password';
        break;
      default:
        emailHtml = userInviteTemplate(user.name, resetLink, tempPassword, expiry);
        subject = 'User Invitation – Set Your Password';
    }

    await EmailService.sendEmail({
      to: user.email,
      subject,
      html: emailHtml,
    });

    return {
      message: `${data.role.charAt(0).toUpperCase() + data.role.slice(1)} invited successfully (email sent)`,
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }
  static async getAllUser(currentUserId: string, role?: string) {
    const query: any = { _id: { $ne: currentUserId } };
    if (role) query.role = role;

    const users = await User.find(query).select('-password').populate('createdBy', 'name email');
    return { count: users.length, users };
  }
  static async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new APIError('User not found');
    }

    await User.findByIdAndDelete(userId);

    return { message: 'User deleted successfully' };
  }

  static async updateUser(userId: string, updateData: Partial<UserInput>) {
    const user = await User.findById(userId);
    if (!user) {
      throw new APIError('User not found');
    }

    if (updateData.email && updateData.email !== user.email) {
      const existing = await User.findOne({ email: updateData.email });
      if (existing) {
        throw new APIError('Email already in use');
      }
    }

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    Object.assign(user, updateData);
    await user.save();

    return { message: 'User updated successfully', user };
  }
}
