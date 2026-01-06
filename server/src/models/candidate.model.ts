import mongoose, { Schema, Document, model } from 'mongoose';
import { CandidateType, CandidateStage, Status } from '../enums/candidate.enum';

export interface IPipelineEntry {
  actionType: 'added' | 'moved' | 'rejected' | 'reactivated';
  pipelineStage: CandidateStage;
  status: Status;
  actionBy: string;
  date: Date;
  remarks?: string;
}

export interface ICandidate extends Document {
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  candidateType: CandidateType;
  remarks?: string;
  status: Status;
  pipelineStage: CandidateStage;
  job: Schema.Types.ObjectId;
  pipelineHistory: IPipelineEntry[];
  rej_remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineEntrySchema = new Schema<IPipelineEntry>(
  {
    actionType: {
      type: String,
      enum: ['added', 'moved', 'rejected', 'reactivated'],
      required: true,
    },
    pipelineStage: {
      type: String,
      enum: Object.values(CandidateStage),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    actionBy: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { _id: false },
);

const candidateSchema = new Schema<ICandidate>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      defailt: '',
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
    candidateType: {
      type: String,
      enum: Object.values(CandidateType),
      required: true,
    },
    remarks: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    pipelineStage: {
      type: String,
      enum: Object.values(CandidateStage),
      default: CandidateStage.PRELIMINARY,
    },
    pipelineHistory: {
      type: [PipelineEntrySchema],
      default: [],
    },
    rej_remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export const Candidate = model<ICandidate>('Candidate', candidateSchema);
