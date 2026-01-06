import { Request, Response } from 'express';
import { SuperAdminService } from '../services/superAdmin.service';
import { successResponse } from '../utils/responseHandler';

export class SuperAdminController {
  static async createNewUser(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const result = await SuperAdminService.createUser(req.body, userId);
    return successResponse(res, 201, result);
  }
  static async getAllUsers(req: Request, res: Response) {
    const { role } = req.query;
    const userId = (req as any).user._id;
    const users = await SuperAdminService.getAllUser(userId, role as string);
    return successResponse(res, 200, users);
  }
  static async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    const result = await SuperAdminService.deleteUser(userId);
    return successResponse(res, 200, result);
  }
  static async updateUser(req: Request, res: Response) {
    const userId = req.params.id;
    const updateData = req.body;
    const result = await SuperAdminService.updateUser(userId, updateData);
    return successResponse(res, 200, result);
  }
}
