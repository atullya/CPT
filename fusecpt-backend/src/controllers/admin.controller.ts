import { Request, Response } from 'express';
import { AdminService } from '../services/admin.services';
import { successResponse } from '../utils/responseHandler';

export class AdminController {
  static async getAllUsers(req: Request, res: Response) {
    const currentUserRole = (req as any).user?.role;
    const users = await AdminService.getAllUsers(currentUserRole);
    return successResponse(res, 200, users);
  }
}
