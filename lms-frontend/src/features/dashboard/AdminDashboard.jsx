import { motion } from "framer-motion"
import { Users, BookOpen, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/store/AuthContext"
import { useCourses, useUserStats } from "@/hooks/apiHooks"

export default function AdminDashboard() {
  const { user } = useAuth()
  const userStatsQuery = useUserStats()
  const coursesQuery = useCourses()
  const userStats = userStatsQuery.data
  const courses = coursesQuery.data || []

  const stats = [
    { title: "Total Users", value: userStats?.totalUsers ?? "N/A", icon: Users, trend: "From user-service" },
    { title: "Published Courses", value: coursesQuery.isLoading ? "..." : courses.length, icon: BookOpen, trend: "From course-service" },
    { title: "Revenue", value: "N/A", icon: TrendingUp, trend: "Payment service not connected yet" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
                <div className="text-2xl font-bold">{userStatsQuery.isLoading && stat.title === "Total Users" ? "..." : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {(userStatsQuery.isError || coursesQuery.isError) && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Some system metrics could not be loaded from backend services.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {userStats?.usersByRole ? (
            <div className="grid gap-3 md:grid-cols-3">
              {Object.entries(userStats.usersByRole).map(([role, count]) => (
                <div key={role} className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">{role}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Role stats unavailable.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
