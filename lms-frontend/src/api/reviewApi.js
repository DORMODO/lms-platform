import axiosInstance from "./axiosInstance"

export const reviewApi = {
  getByCourse: async (courseId) => {
    const response = await axiosInstance.get(`/reviews/courses/${courseId}`)
    return response.data
  },

  getSummary: async (courseId) => {
    const response = await axiosInstance.get(`/reviews/courses/${courseId}/summary`)
    return response.data
  },

  getById: async (reviewId) => {
    const response = await axiosInstance.get(`/reviews/${reviewId}`)
    return response.data
  },

  create: async (courseId, payload) => {
    const response = await axiosInstance.post(`/reviews/courses/${courseId}`, payload)
    return response.data
  },

  update: async (reviewId, payload) => {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, payload)
    return response.data
  },

  delete: async (reviewId) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`)
    return response.data
  },
}
