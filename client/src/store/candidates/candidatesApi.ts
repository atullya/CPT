import { baseApi } from "../baseApi.config";
import type { Candidate, CreateCandidatePayload } from "./candidatesTypes";

export const candidatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidates: builder.query<
      { success: boolean; data: { data: Candidate[]; pagination: any } },
      void
    >({
      query: () => ({
        url: "/api/candidates",
      }),
      providesTags: ["Candidates"],
    }),

    getCandidateById: builder.query<Candidate, string>({
      query: (id) => `/api/candidates/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Candidates", id }],
    }),

    createCandidate: builder.mutation<any, CreateCandidatePayload>({
      query: (payload) => ({
        url: "/api/candidates",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Candidates"],
    }),

    updateCandidate: builder.mutation<
      any,
      { id: string; data: Partial<CreateCandidatePayload> }
    >({
      query: ({ id, data }) => ({
        url: `/api/candidates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Candidates"],
    }),

    deleteCandidate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/candidates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Candidates"],
    }),

    rejectCandidate: builder.mutation<any, { id: string; rej_remarks: string }>(
      {
        query: ({ id, rej_remarks }) => ({
          url: `/api/candidates/${id}/reject`,
          method: "PATCH",
          body: { rej_remarks },
        }),
        invalidatesTags: ["Candidates"],
      }
    ),

    reactivateCandidate: builder.mutation<
      any,
      { id: string; rej_remarks: string }
    >({
      query: ({ id, rej_remarks }) => ({
        url: `/api/candidates/${id}/reactivate`,
        method: "PATCH",
        body: { rej_remarks },
      }),
      invalidatesTags: ["Candidates"],
    }),
    getCandidatesSearch: builder.query<
      { success: boolean; data: { candidates: Candidate[]; total: number; page: number; totalPages: number } },
      { candidateType?: string; search?: string; status?: string; jobId?: string; limit?: number }
    >({
      query: ({ candidateType, search, status, jobId, limit = 1000 }) => {
        const params = new URLSearchParams();
        if (candidateType) params.append("candidateType", candidateType);
        if (search) params.append("fullName", search);
        if (status) params.append("status", status);
        if (jobId) params.append("jobId", jobId);
        if (limit) params.append("limit", limit.toString());

        return {
          url: `/api/candidates/search?${params.toString()}`,
        };
      },
      providesTags: ["Candidates"],
    }),
  }),
});

export const {
  useGetCandidatesQuery,
  useGetCandidatesSearchQuery,
  useGetCandidateByIdQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useRejectCandidateMutation,
  useReactivateCandidateMutation,
} = candidatesApi;
