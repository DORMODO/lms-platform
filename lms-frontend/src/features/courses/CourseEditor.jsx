import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, GripVertical, Video, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { courseApi } from "@/api/courseApi"
import { useCourse, useCourseLessons } from "@/hooks/apiHooks"
import { useToast } from "@/context/ToastContext"
import CourseThumbnail from "@/components/common/CourseThumbnail"

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const isEditing = !!id
  const existingCourseQuery = useCourse(id)
  const existingLessonsQuery = useCourseLessons(id)

  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: 0,
    difficulty: "BEGINNER",
    category: "",
    thumbnail: "",
    status: "DRAFT",
    lessons: [],
  })

  useEffect(() => {
    if (!existingCourseQuery.data) return

    setCourse((prev) => ({
      ...prev,
      title: existingCourseQuery.data.title || "",
      description: existingCourseQuery.data.description || "",
      price: existingCourseQuery.data.price || 0,
      difficulty: existingCourseQuery.data.difficulty || "BEGINNER",
      category: existingCourseQuery.data.category || "",
      thumbnail: existingCourseQuery.data.thumbnail || "",
      status: existingCourseQuery.data.status || "DRAFT",
    }))
  }, [existingCourseQuery.data])

  useEffect(() => {
    if (!existingLessonsQuery.data) return
    setCourse((prev) => ({ ...prev, lessons: existingLessonsQuery.data }))
  }, [existingLessonsQuery.data])

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: "",
      type: "VIDEO",
      duration: 0,
      order: course.lessons.length + 1,
    }
    setCourse((prev) => ({ ...prev, lessons: [...prev.lessons, newLesson] }))
  }

  const updateLesson = (index, field, value) => {
    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    }))
  }

  const removeLesson = (index) => {
    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    const payload = {
      title: course.title,
      description: course.description,
      price: Number(course.price),
      category: course.category,
      difficultyLevel: course.difficulty,
      thumbnailUrl: course.thumbnail,
    }

    try {
      const savedCourse = isEditing
        ? await courseApi.update(id, payload)
        : await courseApi.create(payload)

      if (course.status === "PUBLISHED") {
        await courseApi.publish(savedCourse.id)
      }

      success("Course saved.")
      navigate("/instructor/courses")
    } catch (err) {
      showError(err.response?.data?.message || err.message || "Could not save course")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Course" : "Create Course"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update course details" : "Fill in the details to create a new course"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            Save as Draft
          </Button>
          <Button onClick={handleSave}>
            {course.status === "PUBLISHED" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={course.title}
                  onChange={(e) => setCourse((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., React Fundamentals"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={course.description}
                  onChange={(e) => setCourse((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what students will learn..."
                  className="w-full min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={course.thumbnail}
                  onChange={(e) => setCourse((prev) => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="https://example.com/course-thumbnail.jpg"
                />
                <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted max-w-xs">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />
                  ) : (
                    <CourseThumbnail title={course.title || "Preview"} category={course.category} className="w-full h-full" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={course.category}
                    onChange={(e) => setCourse((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Programming"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={course.difficulty}
                    onValueChange={(val) => setCourse((prev) => ({ ...prev, difficulty: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lessons</CardTitle>
                <Button onClick={addLesson} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 rounded-lg border"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        {lesson.type === "VIDEO" && <Video className="h-4 w-4 text-blue-500" />}
                        {lesson.type === "TEXT" && <FileText className="h-4 w-4 text-green-500" />}
                        {lesson.type === "QUIZ" && <HelpCircle className="h-4 w-4 text-purple-500" />}
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(index, "title", e.target.value)}
                          placeholder="Lesson title"
                          className="flex-1"
                        />
                        <Select
                          value={lesson.type}
                          onValueChange={(val) => updateLesson(index, "type", val)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIDEO">Video</SelectItem>
                            <SelectItem value="TEXT">Text</SelectItem>
                            <SelectItem value="QUIZ">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(index, "duration", parseInt(e.target.value))}
                          placeholder="Min"
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLesson(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {course.lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No lessons yet. Click "Add Lesson" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">Set to 0 for free course</p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={course.status}
                  onValueChange={(val) => setCourse((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lessons</span>
                  <Badge variant="secondary">{course.lessons.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Total Duration</span>
                  <span className="font-medium">
                    {course.lessons.reduce((acc, l) => acc + l.duration, 0)} min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
