import { Types } from 'mongoose';
import { APIError } from '../middleware/errorHandler';
import { Job } from '../models/job.model';
import { JobInput, JobUpdateSchema } from '../schemas/job.schema';
import { z } from 'zod';
export class JobService {
  static async createJob(data: JobInput, creatorId: string) {
    const existingJob = await Job.findOne({
      title: data.title,
      descriptionUrl: data.descriptionUrl,
    });
    if (existingJob)
      throw new APIError('A job with this title and description URL already exists', 400);

    const initialStatus = data.status ?? 'Open';

    const job = await Job.create({
      ...data,
      status: initialStatus,
      createdBy: creatorId,
      clientLogo: data.clientLogo,
      history: [
        {
          action: 'created',
          user: creatorId,
          changes: [
            { field: 'status', from: null, to: initialStatus },
            { field: 'title', from: null, to: data.title },
          ],
        },
      ],
    });

    return { message: 'Job created successfully', job };
  }

  static async getAllJobs(query: any) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search = '',
      ...filters
    } = query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    const mongoFilters: any = { ...filters };

    if (search) {
      mongoFilters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { descriptionUrl: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(mongoFilters)
      .collation({ locale: 'en', strength: 2 })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);
    const totalJobs = await Job.countDocuments(mongoFilters);

    return {
      totalJobs,
      totalPages: Math.ceil(totalJobs / limitNumber),
      currentPage: pageNumber,
      jobs,
    };
  }

  static async getJobById(id: string) {
    const job = await Job.findById(id).populate('history.user', 'name email');
    if (!job) throw new APIError('Job not found', 404);

    const jobObj: any = job.toObject();
    jobObj.history = [...jobObj.history].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return { job: jobObj };
  }

  static async updateJob(id: string, data: z.infer<typeof JobUpdateSchema>, userId: string) {
    const job = await Job.findById(id);
    if (!job) throw new APIError('Job not found', 404);

    const changes: { field: string; from: any; to: any }[] = [];

    Object.entries(data).forEach(([field, newValue]) => {
      if (newValue === undefined) return;

      const oldValue = (job as any)[field];

      if (String(oldValue) !== String(newValue)) {
        changes.push({ field, from: oldValue, to: newValue });
        (job as any)[field] = newValue;
      }
    });

    if (changes.length) {
      job.history.push({
        action: 'updated',
        user: userId,
        changes,
      });
    }

    await job.save();
    return { message: 'Job updated successfully', job };
  }

  static async deleteJob(id: string) {
    const job = await Job.findByIdAndDelete(id);
    if (!job) throw new APIError('Job not found', 404);
    return { message: 'Job deleted successfully' };
  }

  static async getAllJobHistory(query: any) {
    const { page = 1, limit = 20, jobId, userId } = query;

    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);
    const skip = (pageNumber - 1) * limitNumber;

    const matchStage: any = {};

    if (jobId) {
      matchStage._id = new Types.ObjectId(String(jobId));
    }

    if (userId) {
      matchStage['history.user'] = new Types.ObjectId(String(userId));
    }

    const pipeline: any[] = [
      Object.keys(matchStage).length ? { $match: matchStage } : null,

      { $unwind: '$history' },

      {
        $lookup: {
          from: 'users',
          localField: 'history.user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },

      { $sort: { 'history.createdAt': -1 } },

      { $skip: skip },
      { $limit: limitNumber },

      {
        $project: {
          _id: 0,
          jobId: '$_id',
          jobTitle: '$title',
          jobStatus: '$status',

          action: '$history.action',
          remark: '$history.remark',
          changes: '$history.changes',
          createdAt: '$history.createdAt',

          userId: '$user._id',
          userName: '$user.name',
          userEmail: '$user.email',
        },
      },
    ].filter(Boolean);

    const activities = await Job.aggregate(pipeline);

    const countPipeline: any[] = [
      Object.keys(matchStage).length ? { $match: matchStage } : null,
      { $unwind: '$history' },
      { $count: 'total' },
    ].filter(Boolean);

    const countResult = await Job.aggregate(countPipeline);
    const total = countResult[0]?.total ?? 0;

    return {
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      activities,
    };
  }
}
