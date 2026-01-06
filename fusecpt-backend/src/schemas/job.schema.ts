import { z } from 'zod';
import { ContractTypes, JobStatus, OverlapRequirements } from '../enums/job.enums';

export const JobZodSchema = z.object({
  title: z.string().min(1, 'Job Title is required'),
  descriptionUrl: z.string().url('Invalid URL').min(1, 'Job Description URL is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientTimezone: z.string().min(1, 'Client timezone is required'),

  contractType: z.enum(ContractTypes, { message: 'Contract type is required' }),
  overlapRequirement: z.enum(OverlapRequirements, { message: 'Overlap requirement is required' }),

  region: z.array(z.string().min(1)).min(1, 'At least one region is required'),
  minimumExperience: z.preprocess(
    (val) => {
      if (typeof val === 'string' || typeof val === 'number') {
        const num = Number(val);
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z
      .number()
      .int({ message: 'Experience must be an integer' })
      .min(0, { message: 'Experience must be at least 1' })
      .max(50, { message: 'Experience cannot be more than 50' }),
  ),

  remarks: z.string().optional(),

  status: z.enum(JobStatus).default('Open'),

  closedDate: z.preprocess((v) => {
    if (!v) return undefined;
    return typeof v === 'string' ? new Date(v) : v;
  }, z.date().optional()),

  clientLogo: z
    .string()
    .refine(
      (val) => {
        if (val.startsWith('data:image/')) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid logo URL or base64 data' },
    )
    .optional(),
});
export type JobInput = z.infer<typeof JobZodSchema>;
export const JobUpdateSchema = JobZodSchema.partial();
