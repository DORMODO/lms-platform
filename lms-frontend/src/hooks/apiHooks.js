import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { courseApi } from "@/api/courseApi"
import { reviewApi } from "@/api/reviewApi"
import { enrollmentApi } from "@/api/enrollmentApi"
import { lessonApi } from "@/api/lessonApi"
import { progressApi } from "@/api/progressApi"
import { searchApi } from "@/api/searchApi"
import { userApi } from "@/api/userApi"
import { roleApi } from "@/api/roleApi"
import { auditApi } from "@/api/auditApi"
import { paymentApi } from "@/api/paymentApi"
import { notificationApi } from "@/api/notificationApi"

export const queryKeys = {
  courses: ["courses"],
  course: (courseId) => ["courses", courseId],
  lessons: (courseId) => ["courses", courseId, "lessons"],
  enrollments: ["enrollments", "mine"],
  enrollmentCheck: (courseId) => ["courses", courseId, "enrollment"],
  progress: (courseId) => ["courses", courseId, "progress"],
  semanticSearch: (query) => ["search", "semantic", query],
  users: ["users"],
  userStats: ["users", "stats"],
  roles: ["roles"],
  auditLogs: ["auditLogs"],
  payments: ["payments"],
  notifications: ["notifications"],
  unreadCount: ["notifications", "unread-count"],
  reviews: (courseId) => ["courses", courseId, "reviews"],
  reviewSummary: (courseId) => ["courses", courseId, "reviews", "summary"],
}

export const useCourses = (params = {}) => {
  const hasFilters = Object.values(params).some((value) => value !== undefined && value !== "" && value !== "ALL")

  return useQuery({
    queryKey: hasFilters ? [...queryKeys.courses, params] : queryKeys.courses,
    queryFn: () => (hasFilters ? courseApi.search(params) : courseApi.getAll()),
  })
}

export const useCourse = (courseId) => useQuery({
  queryKey: queryKeys.course(courseId),
  queryFn: () => courseApi.getById(courseId),
  enabled: Boolean(courseId),
})

export const useInstructorCourses = () => useQuery({
  queryKey: ["courses", "instructor"],
  queryFn: courseApi.getInstructorCourses,
})

export const useCourseLessons = (courseId) => useQuery({
  queryKey: queryKeys.lessons(courseId),
  queryFn: () => lessonApi.getByCourse(courseId),
  enabled: Boolean(courseId),
})

export const useMyEnrollments = () => useQuery({
  queryKey: queryKeys.enrollments,
  queryFn: enrollmentApi.getMine,
})

export const useEnrollmentCheck = (courseId, options = {}) => useQuery({
  queryKey: queryKeys.enrollmentCheck(courseId),
  queryFn: () => enrollmentApi.check(courseId),
  enabled: Boolean(courseId) && (options.enabled ?? true),
})

export const useCourseProgress = (courseId, options = {}) => useQuery({
  queryKey: queryKeys.progress(courseId),
  queryFn: () => progressApi.getCourseProgress(courseId),
  enabled: Boolean(courseId) && (options.enabled ?? true),
})

export const useEnrollCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enrollmentApi.enroll,
    onSuccess: (_data, courseId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments })
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollmentCheck(courseId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress(courseId) })
    },
  })
}

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, lessonId }) => progressApi.markLessonComplete(courseId, lessonId),
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress(courseId) })
    },
  })
}

export const useSemanticCourseSearch = (query) => useQuery({
  queryKey: queryKeys.semanticSearch(query),
  queryFn: () => searchApi.semanticCourseSearch(query),
  enabled: Boolean(query?.trim()),
})

export const useUsers = () => useQuery({
  queryKey: queryKeys.users,
  queryFn: userApi.getAll,
})

export const useUserStats = () => useQuery({
  queryKey: queryKeys.userStats,
  queryFn: userApi.getStats,
})

export const useRoles = () => useQuery({
  queryKey: queryKeys.roles,
  queryFn: roleApi.getRoles,
})

export const usePermissions = () => useQuery({
  queryKey: [...queryKeys.roles, "permissions"],
  queryFn: roleApi.getPermissions,
})

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleId }) => userApi.updateRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, adminUserId }) => userApi.delete(userId, adminUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export const useAddPermissionToRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, permissionId }) => roleApi.addPermissionToRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, permissionId }) => roleApi.removePermissionFromRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export const useCreatePermission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleApi.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export const useAuditLogs = (params = {}) => useQuery({
  queryKey: [...queryKeys.auditLogs, params],
  queryFn: () => auditApi.getLogs(params),
})

export const usePaymentHistory = () => useQuery({
  queryKey: queryKeys.payments,
  queryFn: paymentApi.getHistory,
})

export const usePay = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentApi.pay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
    },
  })
}

export const useRefundPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, reason }) => paymentApi.refundPayment(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments })
    },
  })
}

export const useAllPayments = () => useQuery({
  queryKey: [...queryKeys.payments, "admin"],
  queryFn: paymentApi.getAllPayments,
})

export const useInstructorEarnings = () => useQuery({
  queryKey: ["payments", "instructor", "earnings"],
  queryFn: paymentApi.getInstructorEarnings,
})

export const useCourseReviews = (courseId) => useQuery({
  queryKey: queryKeys.reviews(courseId),
  queryFn: () => reviewApi.getByCourse(courseId),
  enabled: Boolean(courseId),
})

export const useCourseReviewSummary = (courseId) => useQuery({
  queryKey: queryKeys.reviewSummary(courseId),
  queryFn: () => reviewApi.getSummary(courseId),
  enabled: Boolean(courseId),
})

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, payload }) => reviewApi.create(courseId, payload),
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(courseId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviewSummary(courseId) })
    },
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, payload }) => reviewApi.update(reviewId, payload),
    onSuccess: (data) => {
      if (data?.courseId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews(data.courseId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.reviewSummary(data.courseId) })
      }
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId }) => reviewApi.delete(reviewId),
    onSuccess: (_data, { courseId }) => {
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews(courseId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.reviewSummary(courseId) })
      }
    },
  })
}

export const useNotifications = () => useQuery({
  queryKey: queryKeys.notifications,
  queryFn: notificationApi.getNotifications,
  refetchInterval: 30_000,
})

export const useUnreadCount = () => useQuery({
  queryKey: queryKeys.unreadCount,
  queryFn: notificationApi.getUnreadCount,
  refetchInterval: 30_000,
  select: (data) => data.count,
})

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount })
    },
  })
}

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount })
    },
  })
}
