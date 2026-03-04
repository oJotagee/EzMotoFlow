import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginRequest, LoginResponse } from '@/types';
import { UserPermissionsResponse } from '@/types/permissions';
import { useAuth } from '@/stores/auth';
import { usePermissionsStore } from '@/stores/permissions';
import api from '@/lib/api';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getUserPermissions: async (userId: string): Promise<UserPermissionsResponse> => {
    const response = await api.get<UserPermissionsResponse>(`/users/${userId}/permissions`);
    return response.data;
  }
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { setPermissions } = usePermissionsStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      login(data);

      try {
        const permissionsData = await authService.getUserPermissions(data.id);
        setPermissions(permissionsData.permissions);
      } catch (error) {
        console.error('Failed to load user permissions:', error);
      }

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
  const { clearPermissions } = usePermissionsStore();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      clearPermissions();
      queryClient.clear();
      window.location.href = '/';
    },
    onError: () => {
      logout();
      clearPermissions();
      queryClient.clear();
      window.location.href = '/';
    }
  });
};