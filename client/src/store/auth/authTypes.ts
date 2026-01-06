export interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name?: string; role?: string } | null;
  token?: string | null;
  refreshToken: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface LoginApiResponse {
  success: boolean;
  data: AuthResponse;
}
