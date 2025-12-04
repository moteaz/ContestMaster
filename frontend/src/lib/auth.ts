import { User } from '@/types';

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Set cookie for middleware
  document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const getAuth = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  // Clear cookie
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
