import axiosInstance from './axiosInstance';

export const normalizeAuthResponse = (data, fallbackEmail = '') => {
  const role = data.role || 'STUDENT';

  return {
    token: data.accessToken,
    refreshToken: data.refreshToken || '',
    email: data.email || fallbackEmail,
    role,
    permissions: data.permissions || [],
  };
};

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return normalizeAuthResponse(response.data, email);
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return normalizeAuthResponse(response.data, userData.email);
  },

  validateToken: async (token) => {
    const response = await axiosInstance.get('/auth/validate', {
      params: { token }
    });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return normalizeAuthResponse(response.data);
  },
};
