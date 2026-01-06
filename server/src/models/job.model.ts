import mongoose, { Schema, model, Document } from 'mongoose';
import { ContractTypes, JobStatus, OverlapRequirements } from '../enums/job.enums';

export interface IJobHistory {
  action: 'created' | 'updated';
  user: mongoose.Types.ObjectId | string;
  changes?: {
    field: string;
    from: any;
    to: any;
  }[];
  remark?: string;
  createdAt?: Date;
}

export interface IJob extends Document {
  readonly _id: mongoose.Types.ObjectId | string;
  title: string;
  descriptionUrl: string;
  status: (typeof JobStatus)[number];
  clientName: string;
  clientTimezone: string;
  contractType: (typeof ContractTypes)[number];
  overlapRequirement: (typeof OverlapRequirements)[number];
  region: string[];
  minimumExperience: string;
  remarks: string;
  closedDate?: Date;
  createdBy: string;
  clientLogo?: string;
  history: IJobHistory[];
}

const jobHistorySchema = new Schema<IJobHistory>(
  {
    action: { type: String, enum: ['created', 'updated'], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    remark: { type: String },
    changes: [
      {
        field: { type: String, required: true },
        from: { type: Schema.Types.Mixed },
        to: { type: Schema.Types.Mixed },
      },
    ],
  },
  {
    _id: false,
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    descriptionUrl: { type: String, required: true },
    clientName: { type: String, required: true },
    clientTimezone: { type: String, required: true },
    contractType: {
      type: String,
      enum: ContractTypes,
      required: true,
    },
    overlapRequirement: {
      type: String,
      enum: OverlapRequirements,
      required: true,
    },
    region: { type: [String], required: true },
    minimumExperience: { type: String, required: true },
    remarks: { type: String },
    status: {
      type: String,
      enum: JobStatus,
      default: 'Open',
    },
    closedDate: { type: Date },
    createdBy: { type: String, required: true },
    clientLogo: { type: String, required: false },

    history: { type: [jobHistorySchema], default: [] },
  },
  { timestamps: true },
);

export const Job = model<IJob>('Job', jobSchema);
