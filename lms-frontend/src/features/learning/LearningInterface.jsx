import { useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, Play, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import Skeleton from "@/components/common/Skeleton"
import { useCourse, useCourseLessons, useCourseProgress, useMarkLessonComplete } from "@/hooks/apiHooks"
import { useToast } from "@/context/ToastContext"

export default function LearningInterface() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()

  const courseQuery = useCourse(courseId)
  const lessonsQuery = useCourseLessons(courseId)
  const progressQuery = useCourseProgress(courseId)
  const completeMutation = useMarkLessonComplete()

  const lessons = useMemo(() => lessonsQuery.data || [], [lessonsQuery.data])
  const currentLessonIndex = lessons.findIndex((lesson) => String(lesson.id) === String(lessonId))
  const currentLesson = lessons[currentLessonIndex]
  const progress = progressQuery.data?.progressPercentage || 0

  const navigateToLesson = (lesson) => {
    navigate(`/student/learn/${courseId}/${lesson.id}`)
  }

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync({ courseId, lessonId })
      success("Lesson marked as complete.")
    } catch (err) {
      showError(err.response?.data?.message || err.message || "Could not update lesson progress")
    }
  }

  if (courseQuery.isLoading || lessonsQuery.isLoading) {
    return (
      <div className="h-screen p-6">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    )
  }

  if (courseQuery.isError || lessonsQuery.isError || !courseQuery.data || !currentLesson) {
    return (
      <div className="text-center py-12">
        <p className="font-medium">Lesson not found</p>
        <p className="text-sm text-muted-foreground mt-1">
          {courseQuery.error?.response?.data?.message ||
            lessonsQuery.error?.response?.data?.message ||
            "Could not load this lesson from course-service."}
        </p>
        <Button onClick={() => navigate("/student/courses")} className="mt-4">
          Back to My Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 border-b flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
          <div>
            <h1 className="font-semibold">{courseQuery.data.title}</h1>
            <p className="text-sm text-muted-foreground">{currentLesson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      </motion.header>

      <div className="flex-1 flex overflow-hidden">
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-6 overflow-y-auto">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                {currentLesson.type === "VIDEO" ? (
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Video lesson: {currentLesson.title}</p>
                    {currentLesson.contentUrl && (
                      <a className="text-sm underline opacity-80" href={currentLesson.contentUrl} target="_blank" rel="noreferrer">
                        Open lesson media
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="w-full p-8 text-left">
                    <h2 className="text-2xl font-bold text-white mb-4">{currentLesson.title}</h2>
                    <p className="text-gray-300">
                      {currentLesson.contentUrl || "Lesson content URL has not been configured."}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigateToLesson(lessons[currentLessonIndex - 1])}
                  disabled={currentLessonIndex === 0}
                >
                  Previous
                </Button>

                <Button onClick={handleComplete} disabled={completeMutation.isPending}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {completeMutation.isPending ? "Saving..." : "Mark as Complete"}
                </Button>

                <Button
                  onClick={() => navigateToLesson(lessons[currentLessonIndex + 1])}
                  disabled={currentLessonIndex === lessons.length - 1}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.main>

        <motion.aside initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Course Content</h3>
            <div className="space-y-2">
              {lessons.map((lesson) => {
                const isCurrentLesson = lesson.id === currentLesson.id

                return (
                  <button
                    type="button"
                    key={lesson.id}
                    onClick={() => navigateToLesson(lesson)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left ${
                      isCurrentLesson ? "bg-primary/10 border border-primary/20" : "hover:bg-accent"
                    }`}
                  >
                    {isCurrentLesson ? (
                      <Play className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.type} - {lesson.duration || 0} min
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
