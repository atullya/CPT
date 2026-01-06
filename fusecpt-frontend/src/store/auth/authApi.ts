import { baseApi } from "../baseApi.config";
import type { AuthResponse, LoginPayload } from "./authTypes";

export interface ChangePasswordPayload {
  oldPassword?: string;
  temporaryPassword?: string;
}

export interface ResetPasswordPayload {
  token: string;
  tempPassword: string;
  newPassword: string;
}

export interface ResetPasswordEmailPayload {
  id: string;
  token: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { success: boolean; data: AuthResponse }) =>
        response.data,
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<
      { message: string },
      ChangePasswordPayload
    >({
      query: (data) => ({
        url: "/api/auth/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    sendResetEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordPayload>({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    resetPasswordEmail: builder.mutation<
      { message: string },
      ResetPasswordEmailPayload
    >({
      query: ({ id, token, password }) => ({
        url: "/api/auth/reset-password-email",
        method: "POST",
        body: { id, token, password },
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
    }),

    verifySession: builder.query<any, void>({
      query: () => ({
        url: "/api/job",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useSendResetEmailMutation,
  useResetPasswordMutation,
  useResetPasswordEmailMutation,
  useLogoutMutation,
  useVerifySessionQuery,
} = authApi;
