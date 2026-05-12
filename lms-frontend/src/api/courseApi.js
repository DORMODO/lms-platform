import axiosInstance from "./axiosInstance"

export const normalizeCourse = (course) => ({
  ...course,
  id: course.courseId ?? course.id,
  courseId: course.courseId ?? course.id,
  thumbnail: course.thumbnailUrl ?? course.thumbnail,
  difficulty: course.difficultyLevel ?? course.difficulty,
})

const normalizeCourses = (courses = []) => courses.map(normalizeCourse)

export const courseApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/courses")
    return normalizeCourses(response.data)
  },

  search: async (params = {}) => {
    const queryParams = {}
    if (params.keyword) queryParams.keyword = params.keyword
    if (params.difficulty && params.difficulty !== "ALL") queryParams.difficulty = params.difficulty
    if (params.category) queryParams.category = params.category
    if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice
    if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice
    const response = await axiosInstance.get("/courses/search", { params: queryParams })
    return normalizeCourses(response.data)
  },

  getById: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}`)
    return normalizeCourse(response.data)
  },

  getInstructorCourses: async () => {
    const response = await axiosInstance.get("/courses/instructor")
    return normalizeCourses(response.data)
  },

  create: async (payload) => {
    const response = await axiosInstance.post("/courses", payload)
    return normalizeCourse(response.data)
  },

  update: async (courseId, payload) => {
    const response = await axiosInstance.put(`/courses/${courseId}`, payload)
    return normalizeCourse(response.data)
  },

  publish: async (courseId) => {
    const response = await axiosInstance.put(`/courses/${courseId}/publish`)
    return normalizeCourse(response.data)
  },

  delete: async (courseId) => {
    const response = await axiosInstance.delete(`/courses/${courseId}`)
    return response.data
  },
}
