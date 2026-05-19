import api from "../lib/axios.js";
import type { ApiResponse, User } from "../types/index.js";

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data;
  },
};
