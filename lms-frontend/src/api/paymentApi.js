import axiosInstance from "./axiosInstance"

const normalizePayment = (p) => ({
  id: p.paymentId ?? p.id,
  courseId: p.courseId,
  studentId: p.studentId,
  amount: p.amount,
  currency: p.currency || "USD",
  status: p.status,
  receiptNumber: p.receiptNumber,
  transactionRef: p.transactionRef,
  createdAt: p.createdAt,
})

export const paymentApi = {
  pay: async ({ courseId, amount }) => {
    const res = await axiosInstance.post("/payments/pay", { courseId, amount })
    return normalizePayment(res.data)
  },

  // Get payment history for logged-in student
  getHistory: async () => {
    const res = await axiosInstance.get("/payments/history")
    return Array.isArray(res.data) ? res.data.map(normalizePayment) : []
  },

  // Get all payments (admin only)
  getAllPayments: async () => {
    const res = await axiosInstance.get("/payments")
    return Array.isArray(res.data) ? res.data.map(normalizePayment) : []
  },

  // Get payments for a specific course (instructor earnings)
  getInstructorEarnings: async (courseId) => {
    if (!courseId) {
      return { totalSales: 0, totalStudents: 0, payments: [] }
    }
    const res = await axiosInstance.get(`/payments/by-course/${courseId}`)
    const payments = Array.isArray(res.data) ? res.data.map(normalizePayment) : []
    const completedPayments = payments.filter(p => p.status === "SUCCEEDED")
    return {
      totalSales: completedPayments.reduce((sum, p) => sum + p.amount, 0),
      totalStudents: new Set(completedPayments.map(p => p.studentId)).size,
      payments: completedPayments,
    }
  },

  // Refund a payment
  refundPayment: async (paymentId, reason) => {
    const res = await axiosInstance.post(`/payments/${paymentId}/refund`, { reason })
    return normalizePayment(res.data)
  },
}
