import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserData = {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  role?: string;
};

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string; role: string } | null;
  token: string | null;
  refreshToken: string | null;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_REFRESH_KEY = "auth_refresh_token";

const saveAuthToStorage = (
  accessToken: string,
  refreshToken: string,
  user: { id: string; email: string; name: string; role: string }
) => {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_REFRESH_KEY, refreshToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearAuthFromStorage = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const loadAuthFromStorage = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const refreshToken = localStorage.getItem(AUTH_REFRESH_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);

  if (token && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { token, refreshToken, user };
    } catch {
      clearAuthFromStorage();
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const user = {
        id: action.payload.user.id || (action.payload.user as any)._id,
        name: action.payload.user.name,
        email: action.payload.user.email,
        role: action.payload.user.role || "user",
      } as { id: string; email: string; name: string; role: string };

      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = user;
      state.isAuthenticated = true;

      saveAuthToStorage(
        action.payload.accessToken,
        action.payload.refreshToken,
        user
      );
    },

    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
      clearAuthFromStorage();
    },

    restoreSession: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        user: { id: string; email: string; name: string; role: string } | null;
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user;
    },

    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; name: string; role: string } | null;
      }>
    ) => {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.user) {
        state.user = action.payload.user;
      } else if (!state.user) {
        const storedAuth = loadAuthFromStorage();
        if (storedAuth?.user) state.user = storedAuth.user;
      }

      if (state.user) {
        const storedUser = {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name,
          role: state.user.role ?? "user",
        };
        saveAuthToStorage(
          action.payload.accessToken,
          action.payload.refreshToken,
          storedUser
        );
      }
    },
  },
});

export const { loginSuccess, logout, restoreSession, updateTokens } =
  authSlice.actions;
export default authSlice.reducer;
