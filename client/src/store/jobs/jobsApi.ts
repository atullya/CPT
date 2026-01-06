import { baseApi } from "../baseApi.config";
import type {
  Job,
  CreateJobPayload,
  JobQueryParams,
  PaginatedJobsResponse,
} from "./jobsTypes";
import { mapStatusFromBackend, mapStatusToBackend } from "./jobsTypes";

interface BackendHistoryUser {
  _id: string;
  name?: string;
  email?: string;
}

interface BackendHistoryChange {
  field: string;
  from: unknown;
  to: unknown;
}

export interface BackendHistoryItem {
  action: "created" | "updated";
  user: BackendHistoryUser | null;
  changes?: BackendHistoryChange[];
  createdAt?: string;
}
interface BackendJob {
  _id: string;
  title?: string;
  jobTitle?: string;
  descriptionUrl?: string;
  jobDescription?: string;
  clientName: string;
  clientLogo?: string;
  clientTimezone: string;
  contractType: string;
  overlapRequirement: string;
  region?: string[];
  searchRegion?: string;
  minimumExperience: string;
  status: string;
  remarks?: string;
  totalCandidates?: number;
  activeCandidates?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  history?: BackendHistoryItem[];
}
export type JobHistoryItem = BackendHistoryItem;
export type JobWithHistory = Job & { history?: JobHistoryItem[] };
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const hasId = (v: unknown): v is { _id: string } =>
  isRecord(v) && typeof v._id === "string";

const unwrap = (
  resp: unknown,
  keys: string[] = ["data", "job", "result"]
): unknown => {
  if (!isRecord(resp)) return resp;
  for (const k of keys) {
    if (k in resp) return (resp as Record<string, unknown>)[k];
  }
  return resp;
};

const extractJob = (resp: unknown): BackendJob => {
  const unwrapped = unwrap(resp);
  if (hasId(unwrapped)) return unwrapped as BackendJob;

  if (isRecord(unwrapped) && "job" in unwrapped && hasId(unwrapped.job)) {
    return unwrapped.job as BackendJob;
  }

  const nested = unwrap(resp, ["data"]);
  if (isRecord(nested) && "job" in nested && hasId(nested.job)) {
    return nested.job as BackendJob;
  }

  throw new Error("Invalid job response shape: _id not found");
};

// Transform backend job -> frontend job
const transformBackendJob = (job: BackendJob): Job => ({
  id: job._id,
  jobTitle: job.title || job.jobTitle || "",
  jobDescription: job.descriptionUrl || job.jobDescription || "",
  clientName: job.clientName,
  clientLogo: job.clientLogo || null,
  clientTimezone: job.clientTimezone,
  contractType: job.contractType as Job["contractType"],
  overlapRequirement: job.overlapRequirement as Job["overlapRequirement"],
  searchRegion: (job.region && job.region.length > 0) ? job.region[0] : (job.searchRegion || ""),
  region: job.region || [],
  minimumExperience: job.minimumExperience,
  status: mapStatusFromBackend(job.status),
  remarks: job.remarks,
  totalCandidates: job.totalCandidates || 0,
  activeCandidates: job.activeCandidates || 0,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
  _id: ""
});

function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    const value = obj[key];
    if (value !== undefined) result[key] = value;
  });
  return result;
}

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<PaginatedJobsResponse, JobQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/api/job",
          params: {
            page: queryParams.page || 1,
            limit: queryParams.limit || 10,
            sort: queryParams.sort || "createdAt",
            order: queryParams.order || "desc",
            ...Object.fromEntries(
              Object.entries(queryParams).filter(
                ([key, value]) =>
                  !["page", "limit", "sort", "order"].includes(key) &&
                  value !== undefined
              )
            ),
          },
        };
      },
      transformResponse: (response: unknown) => {
        if (!isRecord(response)) {
          throw new Error("Invalid jobs response");
        }

        const data = response.data || response;
        if (!isRecord(data)) {
          throw new Error("Invalid jobs response structure");
        }

        return {
          totalJobs: Number(data.totalJobs) || 0,
          totalPages: Number(data.totalPages) || 0,
          currentPage: Number(data.currentPage) || 1,
          jobs: Array.isArray(data.jobs)
            ? data.jobs.map(transformBackendJob)
            : [],
        };
      },
      providesTags: (result) =>
        result?.jobs
          ? [
            ...result.jobs.map((j) => ({ type: "Jobs" as const, id: j.id })),
            { type: "Jobs" as const, id: "LIST" },
          ]
          : [{ type: "Jobs" as const, id: "LIST" }],
    }),

    getJobById: builder.query<JobWithHistory, string>({
      query: (id) => `/api/job/${id}`,
      transformResponse: (response: unknown) => {
        const job = extractJob(response) as BackendJob;
        const base = transformBackendJob(job);
        return {
          ...base,
          history: job.history || [],
        } as JobWithHistory;
      },
      providesTags: (_result, _error, id) => [{ type: "Jobs", id }],
    }),

    createJob: builder.mutation<Job, CreateJobPayload>({
      query: (newJob) => {
        const payload = {
          title: newJob.jobTitle,
          descriptionUrl: newJob.jobDescription,
          clientName: newJob.clientName,
          clientLogo: newJob.clientLogo,
          clientTimezone: newJob.clientTimezone,
          contractType: newJob.contractType,
          overlapRequirement: newJob.overlapRequirement,
          region: newJob.region,
          minimumExperience: newJob.minimumExperience,
          status: mapStatusToBackend(newJob.status),
          remarks: newJob.remarks,
        };
        console.log("=== PAYLOAD BEING SENT TO BACKEND ===");
        console.log(JSON.stringify(payload, null, 2));
        return {
          url: "/api/job/create",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: unknown) => {
        if (!isRecord(response)) {
          throw new Error("Invalid create job response");
        }

        const message = (response as Record<string, any>).message;
        const job = extractJob(response);

        console.log(" Create Job Message:", message);
        console.log(" Created Job:", job);

        return transformBackendJob(job);
      },
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),

    updateJob: builder.mutation<
      Job,
      { id: string; data: Partial<CreateJobPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/api/job/${id}`,
        method: "PATCH",
        body: compact({
          title: data.jobTitle,
          descriptionUrl: data.jobDescription,
          clientName: data.clientName,
          clientLogo: data.clientLogo,
          clientTimezone: data.clientTimezone,
          contractType: data.contractType,
          overlapRequirement: data.overlapRequirement,
          region: data.region,
          minimumExperience: data.minimumExperience,
          status: data.status ? mapStatusToBackend(data.status) : undefined,
          remarks: data.remarks,
        }),
      }),
      transformResponse: (response: unknown) => {
        const job = extractJob(response);
        return transformBackendJob(job);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Jobs", id },
        { type: "Jobs", id: "LIST" },
      ],
    }),

    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Jobs", id },
        { type: "Jobs", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useLazyGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
