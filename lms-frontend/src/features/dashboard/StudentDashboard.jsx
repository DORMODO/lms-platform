import { useMemo } from "react"
import { motion } from "framer-motion"
import { BookOpen, CreditCard, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Skeleton from "@/components/common/Skeleton"
import { useAuth } from "@/store/AuthContext"
import { useMyEnrollments, usePaymentHistory } from "@/hooks/apiHooks"

export default function StudentDashboard() {
  const { user } = useAuth()
  const enrollmentsQuery = useMyEnrollments()
  const paymentsQuery = usePaymentHistory()
  const enrollments = enrollmentsQuery.data || []
  const payments = paymentsQuery.data || []

  const totalSpent = useMemo(
    () => payments.filter(p => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0),
    [payments]
  )

  const stats = [
    { title: "Enrolled Courses", value: enrollments.length, icon: BookOpen, trend: "From course-service" },
    { title: "Completed", value: "N/A", icon: Trophy, trend: "Progress API is per-course" },
    { title: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: CreditCard, trend: "From payment-service" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {enrollmentsQuery.isLoading || paymentsQuery.isLoading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentsQuery.isLoading && <Skeleton className="h-32 w-full rounded-lg" />}
          {enrollmentsQuery.isError && (
            <p className="text-sm text-destructive">
              {enrollmentsQuery.error?.response?.data?.message || "Could not load enrollments from course-service."}
            </p>
          )}
          {!enrollmentsQuery.isLoading && !enrollmentsQuery.isError && enrollments.length === 0 && (
            <p className="text-sm text-muted-foreground">No enrolled courses yet.</p>
          )}
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{enrollment.course?.title || `Course #${enrollment.course?.id || "N/A"}`}</h3>
                  <p className="text-sm text-muted-foreground">
                    Enrolled {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : "recently"}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{enrollment.course?.category || "General"}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
