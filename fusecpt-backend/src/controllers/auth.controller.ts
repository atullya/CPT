import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/responseHandler';
import { ENV } from '../config/env';

const ACCESS_TOKEN_MAX_AGE = Number(ENV.ACCESS_TOKEN_MAX_AGE);
const REFRESH_TOKEN_MAX_AGE = Number(ENV.REFRESH_TOKEN_MAX_AGE);

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);
    return successResponse(res, 201, result);
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);

    res.cookie('accessToken', result.accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    res.cookie('refreshToken', result.refreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return successResponse(res, 200, result);
  }

  static async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const userId = (req as any).user._id;
    const result = await AuthService.changePassword(userId, oldPassword, newPassword);
    return successResponse(res, 200, result);
  }

  static async resetPassword(req: Request, res: Response) {
    const token = (req.query.token as string) || (req.body.token as string);
    const { tempPassword, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, tempPassword, newPassword);
    return successResponse(res, 200, result);
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    return successResponse(res, 200, result);
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return successResponse(res, 200, 'Logout Successful');
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;
    const result = await AuthService.updateUser(id, updateData);
    return successResponse(res, 200, result);
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await AuthService.deleteUser(id);
    return successResponse(res, 200, result);
  }

  static async resetPasswordWithEmailToken(req: Request, res: Response) {
    const { id, token, password } = req.body;
    const result = await AuthService.resetPasswordWithEmailToken(id, token, password);
    return successResponse(res, 200, result);
  }

  static async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken || (req.body && req.body.refreshToken);

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await AuthService.refreshAccessToken(refreshToken);
    res.cookie('accessToken', accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return successResponse(res, 200, {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  }
}
