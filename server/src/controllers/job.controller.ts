import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { successResponse } from '../utils/responseHandler';

export class JobController {
  static async createJob(req: Request, res: Response) {
    const user = (req as any).user;
    const result = await JobService.createJob(req.body, user._id);
    return successResponse(res, 201, result);
  }

  static async getAllJobs(req: Request, res: Response) {
    const result = await JobService.getAllJobs(req.query);
    return successResponse(res, 200, result);
  }
  static async getJobHistory(req: Request, res: Response) {
    const result = await JobService.getAllJobHistory(req.query);
    return successResponse(res, 200, result);
  }
  static async getJobById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await JobService.getJobById(id);
    return successResponse(res, 200, result);
  }

  static async updateJob(req: Request, res: Response) {
    const { id } = req.params;
    const userId = (req as any).user._id;
    const result = await JobService.updateJob(id, req.body, userId);
    return successResponse(res, 200, result);
  }

  static async deleteJob(req: Request, res: Response) {
    const { id } = req.params;
    const result = await JobService.deleteJob(id);
    return successResponse(res, 200, result);
  }
}
