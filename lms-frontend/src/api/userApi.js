import axiosInstance from './axiosInstance';

export const userApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  updateRole: async (userId, roleId) => {
    const response = await axiosInstance.put(`/auth/users/${userId}/role`, { roleId });
    return response.data;
  },

  delete: async (userId, adminUserId) => {
    const response = await axiosInstance.delete(`/auth/users/${userId}`, {
      params: { adminUserId },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
};
