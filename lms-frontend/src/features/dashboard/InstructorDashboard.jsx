import { motion } from "framer-motion"
import { BookOpen, Users, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Skeleton from "@/components/common/Skeleton"
import { useAuth } from "@/store/AuthContext"
import { useInstructorCourses } from "@/hooks/apiHooks"

export default function InstructorDashboard() {
  const { user } = useAuth()
  const coursesQuery = useInstructorCourses()
  const courses = coursesQuery.data || []
  const published = courses.filter((course) => course.status === "PUBLISHED").length

  const stats = [
    { title: "My Courses", value: courses.length, icon: BookOpen, trend: `${published} published` },
    { title: "Students", value: "N/A", icon: Users, trend: "Enrollment aggregate API needed" },
    { title: "Avg. Rating", value: "N/A", icon: BarChart3, trend: "Review service not connected yet" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
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
                <div className="text-2xl font-bold">{coursesQuery.isLoading ? "..." : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {coursesQuery.isLoading && <Skeleton className="h-32 w-full rounded-lg" />}
      {coursesQuery.isError && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {coursesQuery.error?.response?.data?.message || "Could not load instructor courses from course-service."}
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
