import mongoose, { Schema, model, Document } from 'mongoose';
import { UserRole } from '../enums/role.enum';
import { UserStatus } from '../enums/userStatus.enum';

export interface IUser extends Document {
  readonly _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  role: 'super-admin' | 'admin' | 'user';
  status: 'Active' | 'Pending';
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdBy?: mongoose.Types.ObjectId | string;
  lastActive?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name can’t be more than 50 characters long'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      maxlength: [128, 'Password can’t exceed 128 characters'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastActive: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
