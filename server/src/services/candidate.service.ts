import { Candidate, ICandidate, IPipelineEntry } from '../models/candidate.model';
import { APIError } from '../middleware/errorHandler';
import { CandidateStage, Status } from '../enums/candidate.enum';
import mongoose from 'mongoose';

export class CandidateService {
  static async addCandidate(data: Partial<ICandidate>, actionBy: string) {
    if (!actionBy) throw new APIError('actionBy (admin name) is required', 400);
    const pipelineStage = data.pipelineStage || CandidateStage.PRELIMINARY;
    const status = data.status || Status.TO_BE_SCHEDULED;

    const initEntry: IPipelineEntry = {
      actionType: 'added',
      pipelineStage,
      status,
      actionBy,
      date: new Date(),
      remarks: data.remarks || '',
    };

    const payload = {
      ...data,
      pipelineStage,
      status,
      pipelineHistory: [initEntry],
    };

    const candidate = await Candidate.create(payload);
    return candidate.toObject();
  }

  static async getAllCandidates(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const candidates = await Candidate.find().skip(skip).limit(limit).sort({ createdAt: -1 });

    const total = await Candidate.countDocuments();

    return {
      data: candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCandidateById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new APIError('Invalid id', 400);
    const candidate = await Candidate.findById(id);
    if (!candidate) throw new APIError('Candidate not found', 404);
    return candidate;
  }

  static async getCandidateDetails(id: string) {
    const candidate = await Candidate.findById(id)
      .populate<{ job: { title: string } }>('job')
      .lean();

    if (!candidate) {
      throw new APIError('Candidate not found', 404);
    }

    return {
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      candidateType: candidate.candidateType,
      remarks: candidate.remarks,
      status: candidate.status,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
      jobTitle: candidate.job?.title || 'N/A',
      pipelineHistory: candidate.pipelineHistory || [],
    };
  }

  static async updateCandidate(id: string, updateData: Partial<any>, actionBy?: string) {
    const oldCandidate = await Candidate.findById(id);
    if (!oldCandidate) throw new APIError('Candidate not found', 404);

    // Check if status or stage changed
    const statusChanged = updateData.status && updateData.status !== oldCandidate.status;
    const stageChanged =
      updateData.pipelineStage && updateData.pipelineStage !== oldCandidate.pipelineStage;

    // If status or stage changed, add to pipeline history
    if ((statusChanged || stageChanged) && actionBy) {
      const entry: IPipelineEntry = {
        actionType: 'moved',
        pipelineStage: updateData.pipelineStage || oldCandidate.pipelineStage,
        status: updateData.status || oldCandidate.status,
        actionBy,
        date: new Date(),
      };

      // Add to pipelineHistory array
      if (!updateData.pipelineHistory) {
        updateData.pipelineHistory = [...(oldCandidate.pipelineHistory || []), entry];
      }
    }

    const candidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!candidate) throw new APIError('Candidate not found', 404);

    return candidate;
  }

  static async rejectCandidate(id: string, rej_remarks: string, actionBy: string) {
    if (!rej_remarks) throw new APIError('rej_remarks is required when rejecting candidate', 400);
    if (!actionBy) throw new APIError('actionBy (admin name) is required', 400);

    const candidate = await Candidate.findById(id);
    if (!candidate) throw new APIError('Candidate not found', 404);

    const entry: IPipelineEntry = {
      actionType: 'rejected',
      pipelineStage: candidate.pipelineStage,
      status: Status.REJECTED,
      actionBy,
      date: new Date(),
      remarks: rej_remarks,
    };

    candidate.status = Status.REJECTED;
    candidate.rej_remarks = rej_remarks;
    candidate.pipelineHistory.push(entry);

    await candidate.save();
    return candidate;
  }

  static async reactivateCandidate(id: string, rej_remarks: string, actionBy: string) {
    if (!rej_remarks)
      throw new APIError('rej_remarks is required when reactivating candidate', 400);
    if (!actionBy) throw new APIError('actionBy (admin name) is required', 400);

    const candidate = await Candidate.findById(id);
    if (!candidate) throw new APIError('Candidate not found', 404);

    const entry: IPipelineEntry = {
      actionType: 'reactivated',
      pipelineStage: candidate.pipelineStage,
      status: Status.TO_BE_SCHEDULED,
      actionBy,
      date: new Date(),
      remarks: rej_remarks,
    };

    candidate.status = Status.TO_BE_SCHEDULED;
    candidate.rej_remarks = rej_remarks;
    candidate.pipelineHistory.push(entry);

    await candidate.save();
    return candidate;
  }

  static async deleteCandidate(candidateId: string): Promise<{ message: string }> {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new APIError('Candidate not found', 404);
    }
    await Candidate.findByIdAndDelete(candidateId);

    return { message: 'Candidate deleted successfully' };
  }

  static async searchCandidates(filters: any, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const candidates = await Candidate.find(filters)
      .populate('job', 'title department')
      .skip(skip)
      .limit(limit);

    const total = await Candidate.countDocuments(filters);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      candidates,
    };
  }
}
