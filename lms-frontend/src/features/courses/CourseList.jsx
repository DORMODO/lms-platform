import { useMemo, useState } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { Search, BookOpen, Clock, Filter, Grid, List, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Skeleton from "@/components/common/Skeleton"
import { useAuth } from "@/store/AuthContext"
import { useCourses, useInstructorCourses } from "@/hooks/apiHooks"
import CourseThumbnail from "@/components/common/CourseThumbnail"

export default function CourseList() {
  const [search, setSearch] = useState("")
  const [view, setView] = useState("grid")
  const [difficulty, setDifficulty] = useState("ALL")
  const { user } = useAuth()
  const isInstructor = user?.role === "INSTRUCTOR"
  const isAdmin = user?.role === "ADMIN"

  const publicCoursesQuery = useCourses({
    keyword: search.trim() || undefined,
    difficulty: difficulty === "ALL" ? undefined : difficulty,
  })
  const instructorCoursesQuery = useInstructorCourses()
  const coursesQuery = isInstructor ? instructorCoursesQuery : publicCoursesQuery

  const courses = useMemo(() => coursesQuery.data || [], [coursesQuery.data])
  const detailBasePath = isInstructor ? "/instructor/courses" : "/student/courses"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{isInstructor ? "My Courses" : "Courses"}</h1>
          <p className="text-muted-foreground">
            {isInstructor ? "Manage your courses from the course service" : "Browse and enroll in published courses"}
          </p>
        </div>
        {(isInstructor || isAdmin) && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button variant={view === "grid" ? "default" : "ghost"} size="icon" onClick={() => setView("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "ghost"} size="icon" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {coursesQuery.isLoading && (
        <div className={view === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-lg" />
          ))}
        </div>
      )}

      {coursesQuery.isError && (
        <div className="text-center py-12 border rounded-lg">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">Could not load courses</p>
          <p className="text-sm text-muted-foreground mt-1">
            {coursesQuery.error?.response?.data?.message || coursesQuery.error?.message || "Course service request failed."}
          </p>
        </div>
      )}

      {!coursesQuery.isLoading && !coursesQuery.isError && (
        <motion.div
          layout
          className={view === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              layout
            >
              <Link to={`${detailBasePath}/${course.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                    ) : (
                      <CourseThumbnail title={course.title} category={course.category} className="w-full h-48" />
                    )}
                    <Badge className="absolute top-2 right-2" variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
                      {course.status || "PUBLISHED"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.category || "General"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.difficulty || "Level N/A"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                      {course.featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!coursesQuery.isLoading && !coursesQuery.isError && courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}
    </motion.div>
  )
}
