import axiosInstance from "./axiosInstance"

const normalizeEnrollment = (enrollment) => ({
  ...enrollment,
  id: enrollment.id,
  studentId: enrollment.studentId,
  courseId: enrollment.course?.courseId ?? enrollment.courseId,
  courseName: enrollment.course?.title ?? "",
  enrolledAt: enrollment.enrolledAt,
  progress: enrollment.progress ?? 0,
})

export const enrollmentApi = {
  enroll: async (courseId) => {
    const response = await axiosInstance.post(`/courses/${courseId}/enroll`)
    return response.data
  },

  getMine: async () => {
    const response = await axiosInstance.get("/courses/my-enrollments")
    return (response.data || []).map(normalizeEnrollment)
  },

  check: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}/enrollment-check`)
    return response.data
  },
}
