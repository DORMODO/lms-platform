import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Star, Clock, BookOpen, GraduationCap, Code, BarChart3, Palette, Cloud, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import SearchBar from "@/components/search/SearchBar"
import { useAuth } from "@/store/AuthContext"
import { useCourses } from "@/hooks/apiHooks"
import CourseThumbnail from "@/components/common/CourseThumbnail"

const categories = [
  { name: "Programming", icon: Code, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", count: 3 },
  { name: "Data Science", icon: BarChart3, color: "bg-green-500/10 text-green-600 dark:text-green-400", count: 2 },
  { name: "Design", icon: Palette, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", count: 1 },
  { name: "Mobile", icon: Smartphone, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", count: 1 },
  { name: "Cloud", icon: Cloud, color: "bg-sky-500/10 text-sky-600 dark:text-sky-400", count: 1 },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const { user } = useAuth()
  const navigate = useNavigate()
  const coursesQuery = useCourses({ keyword: search.trim() || undefined })

  const courses = useMemo(() => coursesQuery.data || [], [coursesQuery.data])

  const filtered = useMemo(() => {
    let result = courses
    if (selectedCategory !== "ALL") {
      result = result.filter((c) => c.category === selectedCategory)
    }
    return result
  }, [courses, selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="h-16 border-b bg-card sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline">LMS Platform</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <button onClick={() => setSelectedCategory("ALL")} className="hover:text-foreground transition-colors">All Courses</button>
          {categories.slice(0, 4).map((cat) => (
            <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className="hover:text-foreground transition-colors">
              {cat.name}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Button onClick={() => navigate(`/${user.role.toLowerCase()}/dashboard`)}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Log In</Button>
              <Button onClick={() => navigate("/register")}>Sign Up</Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn from the best, at your own pace
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl">
              Explore thousands of courses in programming, data science, design, and more. Start learning today.
            </p>
            <div className="mt-8">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Programming", "Data Science", "Design", "Mobile", "Cloud"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSelectedCategory(tag); setSearch("") }}
                  className="text-sm px-3 py-1 rounded-full border hover:bg-accent transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? "ALL" : cat.name)}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                selectedCategory === cat.name
                  ? "border-primary bg-primary/5"
                  : "hover:border-border/80 hover:shadow-sm"
              }`}
            >
              <div className={`p-3 rounded-lg ${cat.color}`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="font-medium text-sm">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count} courses</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory === "ALL" ? "All Courses" : `${selectedCategory} Courses`}
          </h2>
          <span className="text-sm text-muted-foreground">{filtered.length} results</span>
        </div>

        {coursesQuery.isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-72" />
            ))}
          </div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((course) => (
            <motion.div key={course.id} variants={item}>
              <Link to={`/courses/${course.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full group">
                  <div className="relative">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover" />
                    ) : (
                      <CourseThumbnail title={course.title} category={course.category} className="w-full h-44" />
                    )}
                    <Badge className="absolute top-2 right-2" variant={course.price === 0 ? "secondary" : "default"}>
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded bg-secondary">{course.difficulty}</span>
                      <span>{course.category}</span>
                    </div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{course.instructorName || "Expert Instructor"}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{course.rating || "—"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({course.enrolledCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {(course.lessons || []).reduce((sum, l) => sum + (l.duration || 0), 0)} min
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {(course.lessons || []).length} lessons
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {!coursesQuery.isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">LMS Platform</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 LMS Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
