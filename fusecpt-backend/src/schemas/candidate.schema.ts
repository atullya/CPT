import { z } from 'zod';
import { CandidateType, CandidateStage, Status } from '../enums/candidate.enum';

export const addCandidateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(7, 'Invalid phone number').optional().nullable(),
  resumeUrl: z.string().url('Invalid resume URL'),
  candidateType: z.nativeEnum(CandidateType, {
    message: 'Candidate type must be internal or external',
  }),
  remarks: z.string().max(200).optional(),
  job: z.string().length(24, 'Invalid Job ID'),
  pipelineStage: z.nativeEnum(CandidateStage),
  status: z.nativeEnum(Status),
});

export const getCandidateByIdSchema = z.object({
  id: z.string().length(24, 'Invalid Candidate ID'),
});

export const updateCandidateSchema = addCandidateSchema.partial();

export const deleteCandidateSchema = z.object({
  id: z.string().length(24, 'Invalid Candidate ID'),
});

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
