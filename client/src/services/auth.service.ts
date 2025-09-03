import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginRequest, LoginResponse } from '@/types';
import { useAuth } from '@/stores/auth';
import api from '@/lib/api';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      throw error;
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      window.location.href = '/';
    },
    onError: () => {
      logout();
      queryClient.clear();
      window.location.href = '/';
    }
  });
};