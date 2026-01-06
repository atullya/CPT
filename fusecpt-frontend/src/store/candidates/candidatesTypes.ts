import type { Key } from "react";

export interface CandidateState {
  list: Candidate[];
  selectedId: string | null;
}

export interface Candidate {
  updatedAt: string | number | Date;
  remarks: string;
  candidateType: string;
  resumeUrl: string;
  createdAt: any;
  status: string;
  pipelineStage: string;
  job: any;
  _id: Key | null | undefined;
  phone: string;
  email: string;
  fullName: string;
  id: string;
  name: string;
  jobId: string;
}

export interface CreateCandidatePayload {
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  candidateType: string;
  remarks: string;
  job: string;
  status: string;
  pipelineStage: string;
}

export interface PipelineEntry {
  actionType: 'added' | 'moved' | 'rejected' | 'reactivated';
  pipelineStage: string;
  status: string;
  actionBy: string;
  date: string;
  remarks?: string;
}

export interface Candidate {
  remarks: string;
  candidateType: string;
  resumeUrl: string;
  createdAt: any;
  status: string;
  pipelineStage: string;
  job: any;
  _id: Key | null | undefined;
  phone: string;
  email: string;
  fullName: string;
  id: string;
  name: string;
  jobId: string;
  pipelineHistory?: PipelineEntry[];
  rej_remarks?: string;
}
