import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { UserRole } from '../enums/role.enum';
import { hashPassword } from '../utils/bcrypt';
import { User } from '../models/user.model';
import { ENV } from '../config/env';
import { logger } from '../config/logger';
export async function seedUsers() {
  try {
    const mongoUri = ENV.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB for user seeding');

    const defaultUsers = [
      {
        name: 'Super Admin User',
        email: 'superadmin@gmail.com',
        password: '1234567890',
        role: UserRole.SUPER_ADMIN,
      },
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: '1234567890',
        role: UserRole.ADMIN,
      },
      {
        name: 'Normal User',
        email: 'user@gmail.com',
        password: '1234567890',
        role: UserRole.USER,
      },
    ];

    for (const u of defaultUsers) {
      const existing = await User.findOne({ email: u.email });

      if (existing) {
        logger.info(`User with email ${u.email} already exists, skipping`);
        continue;
      }

      const hashed = await hashPassword(u.password);

      const created = await User.create({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      });

      logger.info(`Created ${u.role} user: ${created.email} (password: ${u.password})`);
    }

    logger.info('User seeding done');
  } catch (err) {
    logger.error('Error during user seeding:', err);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedUsers();
