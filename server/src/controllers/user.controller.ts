import { Request, Response } from 'express';
import { successResponse } from '../utils/responseHandler';
import { UserService } from '../services/user.services';

export class UserController {
  static async getAllUsersForUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsersForUsers();
    return successResponse(res, 200, users);
  }
}
