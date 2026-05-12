import axiosInstance from './axiosInstance';

export const auditApi = {
  getLogs: async (params = {}) => {
    const response = await axiosInstance.get('/audit', { params });
    return response.data;
  },

  getLogById: async (id) => {
    const response = await axiosInstance.get(`/audit/${id}`);
    return response.data;
  },
};
