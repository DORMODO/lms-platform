import { useMemo } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, CreditCard, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Skeleton from "@/components/common/Skeleton"
import { useInstructorEarnings, useMyEnrollments } from "@/hooks/apiHooks"

export default function InstructorPaymentPage() {
  const earningsQuery = useInstructorEarnings()
  const enrollmentsQuery = useMyEnrollments()

  const earnings = earningsQuery.data
  const totalStudents = useMemo(() => {
    if (!enrollmentsQuery.data) return 0
    const unique = new Set(enrollmentsQuery.data.map((e) => e.studentId))
    return unique.size
  }, [enrollmentsQuery.data])

  const stats = [
    {
      title: "Total Revenue",
      value: earnings ? `$${earnings.totalRevenue.toFixed(2)}` : "...",
      icon: DollarSign,
      color: "text-green-600",
      sub: "Gross sales before fees",
    },
    {
      title: "Net Earnings",
      value: earnings ? `$${earnings.netEarnings.toFixed(2)}` : "...",
      icon: TrendingUp,
      color: "text-blue-600",
      sub: "After platform fees",
    },
    {
      title: "Total Sales",
      value: earnings?.totalSales ?? "...",
      icon: CreditCard,
      color: "text-purple-600",
      sub: "Completed transactions",
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-amber-600",
      sub: "Enrolled students",
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your course sales and revenue</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {earningsQuery.isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {earningsQuery.isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div>
          ) : earnings ? (
            <div className="space-y-6">
              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Platform Fee Rate</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Gross Revenue</span>
                  <span className="font-semibold text-lg">${earnings.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-medium">Net Earnings</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                    ${earnings.netEarnings.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{earnings.totalSales}</p>
                  <p className="text-xs text-muted-foreground">Courses Sold</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Unique Students</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No earnings data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
