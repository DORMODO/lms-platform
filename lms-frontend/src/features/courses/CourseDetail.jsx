import { useMemo } from "react"
import { useParams, Link, useLocation } from "react-router"
import { motion } from "framer-motion"
import {
  Clock, Play, CheckCircle, Lock, BookOpen,
  Star, Users, BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/layout/Navbar"
import Skeleton from "@/components/common/Skeleton"
import { useAuth } from "@/store/AuthContext"
import { useToast } from "@/context/ToastContext"
import CourseThumbnail from "@/components/common/CourseThumbnail"
import CourseReviews from "@/features/courses/CourseReviews"
import {
  useCourse,
  useCourseLessons,
  useCourseProgress,
  useEnrollmentCheck,
  useEnrollCourse,
} from "@/hooks/apiHooks"

const diffStyles = {
  BEGINNER: { label: "Beginner", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  INTERMEDIATE: { label: "Intermediate", class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  ADVANCED: { label: "Advanced", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

const typeStyles = {
  VIDEO: { label: "Video", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  QUIZ: { label: "Quiz", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  TEXT: { label: "Article", class: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" },
}

function RatingStars({ rating }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("full")
    else if (i === full && half) stars.push("half")
    else stars.push("empty")
  }
  return (
    <span className="inline-flex items-center gap-0.5">
      {stars.map((s, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${s === "full" ? "fill-amber-400 text-amber-400" : s === "half" ? "fill-amber-400/50 text-amber-400" : "fill-none text-muted-foreground"}`}
        />
      ))}
    </span>
  )
}


export default function CourseDetail() {
  const { id } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const role = user?.role
  const isStudent = role === "STUDENT"
  const isLoggedIn = Boolean(user)

  const { success, error: showError } = useToast()

  const courseQuery = useCourse(id)
  const lessonsQuery = useCourseLessons(id)
  const enrollmentQuery = useEnrollmentCheck(id, { enabled: isStudent })
  const progressQuery = useCourseProgress(id, { enabled: isStudent })
  const enrollMutation = useEnrollCourse()

  const course = courseQuery.data
  const lessons = useMemo(() => lessonsQuery.data || [], [lessonsQuery.data])
  const isEnrolled = Boolean(enrollmentQuery.data?.enrolled)
  const progress = progressQuery.data?.progressPercentage || 0
  const completedIds = useMemo(() => {
    const ids = progressQuery.data?.completedLessons
    return ids ? new Set(ids.map(Number)) : new Set()
  }, [progressQuery.data])

  const isPublicRoute = location.pathname.match(/^\/courses\//)
  const backPath = !isLoggedIn ? "/" : role === "INSTRUCTOR" ? "/instructor/courses" : "/student/courses"

  const totalDuration = useMemo(
    () => lessons.reduce((sum, l) => sum + (l.duration || 0), 0),
    [lessons]
  )

  if (courseQuery.isLoading) {
    return (
      <>
        {isPublicRoute && <div className="border-b"><Navbar /></div>}
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </>
    )
  }

  if (courseQuery.isError || !course) {
    return (
      <>
        {isPublicRoute && <div className="border-b"><Navbar /></div>}
        <div className="text-center py-12 max-w-lg mx-auto px-4">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <p className="font-semibold text-lg mt-4">Course not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {courseQuery.error?.response?.data?.message || courseQuery.error?.message || "This course may no longer be available."}
          </p>
          <Button asChild className="mt-6">
            <Link to={backPath}>Back to Courses</Link>
          </Button>
        </div>
      </>
    )
  }

  const diffInfo = diffStyles[course.difficulty] || diffStyles.BEGINNER

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {isPublicRoute && (
        <div className="border-b mb-6">
          <Navbar />
        </div>
      )}
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/40 min-h-[240px] flex items-center">
        {course.thumbnail && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${course.thumbnail})` }}
          />
        )}
        <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10 text-primary-foreground">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10">
              {course.category || "General"}
            </Badge>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffInfo.class}`}>
              {diffInfo.label}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{course.title}</h1>
          <p className="mt-2 text-primary-foreground/80 max-w-2xl text-sm sm:text-base line-clamp-2">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-sm text-primary-foreground/80">
            {course.instructorName && (
              <span className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6 border border-primary-foreground/30">
                  <AvatarFallback className="text-[10px] bg-primary-foreground/20 text-primary-foreground">
                    {course.instructorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {course.instructorName}
              </span>
            )}
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <RatingStars rating={course.rating} />
                <span className="font-medium">{course.rating}</span>
              </span>
            )}
            {course.enrolledCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.enrolledCount.toLocaleString()} enrolled
              </span>
            )}
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {totalDuration} min
            </span>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instructor card */}
          {course.instructorName && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Instructor</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border">
                      <AvatarFallback className="bg-muted text-lg font-medium">
                        {course.instructorName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">{course.instructorName}</p>
                      <p className="text-sm text-muted-foreground">Course Instructor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Curriculum */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">Curriculum</h2>
                <span className="text-sm text-muted-foreground">{lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} &middot; {totalDuration} min</span>
              </CardHeader>
              <CardContent>
                {lessonsQuery.isLoading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                  </div>
                )}
                {lessonsQuery.isError && (
                  <p className="text-sm text-destructive">Could not load lessons.</p>
                )}
                {!lessonsQuery.isLoading && !lessonsQuery.isError && lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No lessons have been added yet.</p>
                  </div>
                )}
                {!lessonsQuery.isLoading && !lessonsQuery.isError && lessons.length > 0 && (
                  <div className="divide-y">
                    {lessons.map((lesson, index) => {
                      const isCompleted = completedIds.has(Number(lesson.id))
                      const isLocked = (isStudent && !isEnrolled && index > 0) || (!isLoggedIn && index > 0)

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-4 py-3.5 px-1 transition-colors ${
                            isLocked ? "opacity-50" : "hover:bg-accent/40 rounded-sm -mx-1 px-2"
                          }`}
                        >
                          <div className="shrink-0 w-8 flex justify-center">
                            {isCompleted ? (
                              <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            ) : isLocked ? (
                              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <Play className="h-3.5 w-3.5 text-primary ml-0.5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-medium truncate ${isCompleted ? "text-green-600 dark:text-green-400" : ""}`}>
                                {lesson.title}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${(typeStyles[lesson.type] || typeStyles.VIDEO).class}`}>
                                {(typeStyles[lesson.type] || typeStyles.VIDEO).label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {isCompleted ? "Completed" : isLocked ? "Preview unavailable" : `${lesson.duration || 0} min`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Reviews */}
          <CourseReviews courseId={id} />
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Card className="overflow-hidden">
              {/* Thumbnail at top of sidebar */}
              <div className="aspect-video bg-muted overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <CourseThumbnail title={course.title} category={course.category} className="w-full h-full" />
                )}
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}</span>
                  {course.price > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${(course.price * 1.4).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* CTA */}
                {isLoggedIn && isStudent && isEnrolled ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Button className="w-full" size="lg" disabled={lessons.length === 0} asChild={lessons.length > 0}>
                      {lessons.length > 0 ? (
                        <Link to={`/student/learn/${course.id}/${lessons[0].id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Link>
                      ) : (
                        <span>Continue Learning</span>
                      )}
                    </Button>
                  </div>
                ) : isLoggedIn && isStudent && course.price === 0 ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => enrollMutation.mutate(course.id, {
                      onSuccess: () => success("You are now enrolled!"),
                      onError: (err) => showError(err.message || "Enrollment failed"),
                    })}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll for Free"}
                  </Button>
                ) : isLoggedIn && isStudent ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/student/checkout/${course.id}`}>
                      Enroll Now
                    </Link>
                  </Button>
                ) : isLoggedIn ? (
                  <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-muted-foreground">
                    <BarChart className="h-4 w-4 shrink-0" />
                    You have instructor or admin access to this course
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Button className="w-full" size="lg" asChild>
                      <Link to={`/login?redirect=${encodeURIComponent(`/courses/${course.id}`)}`}>
                        Log in to Enroll
                      </Link>
                    </Button>
                    <Button className="w-full" size="lg" variant="outline" asChild>
                      <Link to={`/register?redirect=${encodeURIComponent(`/courses/${course.id}`)}`}>
                        Create Free Account
                      </Link>
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Course stats */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <BarChart className="h-3.5 w-3.5" />
                      Difficulty
                    </span>
                    <span className="font-medium">{diffInfo.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      Category
                    </span>
                    <span className="font-medium">{course.category || "General"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Duration
                    </span>
                    <span className="font-medium">{totalDuration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5" />
                      Lessons
                    </span>
                    <span className="font-medium">{lessons.length}</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5" />
                        Rating
                      </span>
                      <span className="font-medium">{course.rating} / 5.0</span>
                    </div>
                  )}
                  {course.enrolledCount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        Students
                      </span>
                      <span className="font-medium">{course.enrolledCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
