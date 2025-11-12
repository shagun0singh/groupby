import { apiRequest } from './apiClient';

export const login = async ({ email, password }) => {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
};

export const signup = async ({ firstName, lastName, email, phone, password, confirmPassword }) => {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: { firstName, lastName, email, phone, password, confirmPassword }
  });
};

