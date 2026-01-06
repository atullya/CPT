import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { CandidateService } from '../services/candidate.service';
import { APIError } from '../middleware/errorHandler';

function getActorNameFromReq(req: Request) {
  const user = (req as any).user || {};
  return user.name || user.fullName || user.email || 'system';
}

export class CandidateController {
  static async addCandidate(req: Request, res: Response) {
    try {
      const actor = getActorNameFromReq(req);
      const result = await CandidateService.addCandidate(req.body, actor);
      return successResponse(res, 201, result);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async getAllCandidates(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await CandidateService.getAllCandidates(page, limit);
      return successResponse(res, 200, result);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async getCandidateById(req: Request, res: Response) {
    try {
      const candidate = await CandidateService.getCandidateById(req.params.id);
      return successResponse(res, 200, candidate);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async getCandidateDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const details = await CandidateService.getCandidateDetails(id);
      return successResponse(res, 200, details);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async updateCandidate(req: Request, res: Response) {
    const candidateId = req.params.id;
    const updateData = req.body;
    const actionBy = getActorNameFromReq(req);

    const updatedCandidate = await CandidateService.updateCandidate(
      candidateId,
      updateData,
      actionBy,
    );

    return successResponse(res, 200, updatedCandidate);
  }

  static async deleteCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await CandidateService.deleteCandidate(id);
      return successResponse(res, 200, result);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async searchCandidates(req: Request, res: Response) {
    try {
      const { status, fullName } = req.query;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: any = {};
      if (status) {
        const statusArray = String(status)
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        filters.status = { $in: statusArray };
      }

      if (fullName) filters.fullName = { $regex: fullName, $options: 'i' };

      const result = await CandidateService.searchCandidates(filters, page, limit);
      return successResponse(res, 200, result);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async rejectCandidate(req: Request, res: Response) {
    try {
      const { rej_remarks } = req.body;
      const actor = getActorNameFromReq(req);

      const result = await CandidateService.rejectCandidate(req.params.id, rej_remarks, actor);

      return successResponse(res, 200, result);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }

  static async reactivateCandidate(req: Request, res: Response) {
    try {
      const { rej_remarks } = req.body;
      const actor = getActorNameFromReq(req);

      const result = await CandidateService.reactivateCandidate(req.params.id, rej_remarks, actor);

      return successResponse(res, 200, result);
    } catch (err: unknown) {
      return errorResponse(res, err);
    }
  }
}
