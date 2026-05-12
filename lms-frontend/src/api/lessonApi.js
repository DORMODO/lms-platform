import axiosInstance from "./axiosInstance"

export const normalizeLesson = (lesson) => ({
  ...lesson,
  id: lesson.lessonId ?? lesson.id,
})

export const lessonApi = {
  getByCourse: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}/lessons`)
    return (response.data || []).map(normalizeLesson)
  },

  create: async (courseId, payload) => {
    const response = await axiosInstance.post(`/courses/${courseId}/lessons`, payload)
    return response.data
  },

  update: async (courseId, lessonId, payload) => {
    const response = await axiosInstance.put(`/courses/${courseId}/lessons/${lessonId}`, payload)
    return response.data
  },

  delete: async (courseId, lessonId) => {
    const response = await axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}`)
    return response.data
  },
}
