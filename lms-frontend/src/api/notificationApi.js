import axiosInstance from "./axiosInstance"

export const notificationApi = {
  getNotifications: async () => {
    const response = await axiosInstance.get("/notifications")
    return response.data
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get("/notifications/unread-count")
    return response.data
  },

  markAsRead: async (id) => {
    await axiosInstance.patch(`/notifications/${id}/read`)
  },

  markAllAsRead: async () => {
    await axiosInstance.patch("/notifications/read-all")
  },
}
