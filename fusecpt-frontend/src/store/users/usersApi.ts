import { baseApi } from "../baseApi.config";
import type { User, CreateUserRequest, UpdateUserRequest } from "./usersTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/api/users",
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/super-admin/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    createUser: builder.mutation<void, CreateUserRequest>({
      query: (userData) => ({
        url: "/api/super-admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: (userData) => ({
        url: `/api/super-admin/update/${userData._id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi;
