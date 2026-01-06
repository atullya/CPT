import 'dotenv/config';
import mongoose from 'mongoose';
import { ENV } from '../config/env';
import { Job } from '../models/job.model';
import { User } from '../models/user.model';
import { UserRole } from '../enums/role.enum';
import { ContractTypes, JobStatus, OverlapRequirements } from '../enums/job.enums';
import { logger } from '../config/logger';

async function seedJobs() {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    logger.info('Connected to MongoDB for job seeding');
    const creator = await User.findOne({ role: UserRole.SUPER_ADMIN });

    if (!creator) {
      logger.error('No super-admin user found. Run user seeding first.');
      process.exit(1);
    }

    logger.info(`Using creator: ${creator.email}`);

    const jobsData = [
      {
        title: 'Senior Frontend Developer',
        descriptionUrl: 'https://example.com/jobs/senior-frontend',
        clientName: 'ABC Corp',
        clientTimezone: 'PST',
        contractType: ContractTypes[0],
        overlapRequirement: OverlapRequirements[0],
        region: ['USA', 'Canada'],
        minimumExperience: '3',
        remarks: 'Seeded job #1',
        status: JobStatus[0],
      },
      {
        title: 'Backend Node Developer',
        descriptionUrl: 'https://example.com/jobs/backend-node',
        clientName: 'XYZ Inc',
        clientTimezone: 'EST',
        contractType: ContractTypes[1] || ContractTypes[0],
        overlapRequirement: OverlapRequirements[1] || OverlapRequirements[0],
        region: ['Europe'],
        minimumExperience: '4',
        remarks: 'Seeded job #2',
        status: JobStatus[0],
      },
    ];

    for (const data of jobsData) {
      const existing = await Job.findOne({
        title: data.title,
        descriptionUrl: data.descriptionUrl,
      });

      if (existing) {
        logger.info(`Job "${data.title}" already exists, skipping`);
        continue;
      }

      const job = await Job.create({
        ...data,
        createdBy: creator._id.toString(),
      });
      logger.info(`Created job: "${job.title}"`);
    }
    logger.info('Job seeding completed');
  } catch (err) {
    logger.error('Error during job seeding:', err);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedJobs();
