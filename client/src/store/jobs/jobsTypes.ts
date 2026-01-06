export type JobStatus = 'Open' | 'OnHold' | 'ClosedWon' | 'ClosedLost';
export type ContractType = 'Full-Time' | 'Part-Time' | 'Contract';
export type OverlapRequirement = 'Complete' | 'Partial' | 'None';

export interface Job {
  _id: string;
  id: string;
  jobTitle: string;
  jobDescription: string;
  clientName: string;
  clientLogo?: string | null;
  clientTimezone: string;
  contractType: ContractType;
  overlapRequirement: OverlapRequirement;
  searchRegion: string;
  region: string[];
  minimumExperience: string;
  status: JobStatus;
  remarks?: string;
  totalCandidates: number;
  activeCandidates: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  jobTitle: string;
  jobDescription: string;
  clientName: string;
  clientLogo?: string | null;
  clientTimezone: string;
  contractType: ContractType;
  overlapRequirement: OverlapRequirement;
  searchRegion: string;
  region: string[];
  minimumExperience: string;
  status: JobStatus;
  remarks?: string;
}

export interface JobState {
  selectedJobId: string | null;
  filters: JobFilters;
}

export type JobFilters = {
  status?: JobStatus;
  region?: string;
  clientName?: string;
};

export interface JobQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  region?: string;
  clientName?: string;
  search?: string;
}

export interface PaginatedJobsResponse {
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  jobs: Job[];
}

/* Backend <-> Frontend status mappers */
export const mapStatusFromBackend = (status: string): JobStatus => {
  switch (status) {
    case 'Open': return 'Open';
    case 'On-Hold': return 'OnHold';
    case 'Closed Won': return 'ClosedWon';
    case 'Closed Lost': return 'ClosedLost';
    default: return 'Open';
  }
};

export const mapStatusToBackend = (status: JobStatus): string => {
  switch (status) {
    case 'Open': return 'Open';
    case 'OnHold': return 'On-Hold';
    case 'ClosedWon': return 'Closed Won';
    case 'ClosedLost': return 'Closed Lost';
  }
};
