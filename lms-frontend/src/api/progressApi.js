import axiosInstance from "./axiosInstance"

export const progressApi = {
  getCourseProgress: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}/progress`)
    return response.data
  },

  markLessonComplete: async (courseId, lessonId) => {
    const response = await axiosInstance.put(`/courses/${courseId}/lessons/${lessonId}/complete`)
    return response.data
  },
}
