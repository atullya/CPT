import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, updateTokens } from "./auth/authSlice";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const data: any = result.error.data;
    if (data?.message === "Access token expired") {
      const state = api.getState() as any;
      const refreshToken = state.auth?.refreshToken;

      if (!refreshToken) {
        api.dispatch(logout());
        return result;
      }

      const refreshResult = await rawBaseQuery(
        {
          url: "/api/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const payload: any =
          (refreshResult.data as any).data || refreshResult.data;
        api.dispatch(
          updateTokens({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            user: payload.user,
          })
        );

        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export default baseQuery;
