import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../config/logger';
import { seedUsers } from './seedUsers';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fusecpt';

(async () => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    await seedUsers();

    logger.info('Seeding complete');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
})();
