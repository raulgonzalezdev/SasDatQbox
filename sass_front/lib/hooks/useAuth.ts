import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface User {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, User>({
    mutationFn: async (credentials) => {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.email,
          password: credentials.password || '',
        }).toString(),
      });
      return response;
    },
  });
};

export const useRegister = () => {
  return useMutation<User, Error, User>({
    mutationFn: async (userData) => {
      const response = await apiFetch<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    },
  });
};
