import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Sparkles, Loader2, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCourses, useSemanticCourseSearch } from "@/hooks/apiHooks"
import { cn } from "@/lib/utils"

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function SearchBar({ value = "", onChange, placeholder = "Search for courses..." }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(value, 300)

  const coursesQuery = useCourses({ keyword: debouncedQuery.trim() || undefined })
  const semanticQuery = useSemanticCourseSearch(debouncedQuery)

  const courses = coursesQuery.data || []
  const aiResults = semanticQuery.data?.results || []

  const hasResults = courses.length > 0 || aiResults.length > 0
  const totalResults = Math.min(courses.length, 5) + Math.min(aiResults.length, 3)
  const showLoading = debouncedQuery.trim() && (coursesQuery.isFetching || semanticQuery.isFetching)
  const showDropdown = isOpen && debouncedQuery.trim()

  const handleSelect = useCallback((item) => {
    setIsOpen(false)
    if (item.type === "course") {
      navigate(`/courses/${item.id}`)
    } else {
      onChange?.(item.title)
    }
  }, [navigate, onChange])

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalResults - 1))
        break
      case "Enter": {
        e.preventDefault()
        const items = buildItems()
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          handleSelect(items[selectedIndex])
        } else if (items.length > 0) {
          handleSelect(items[0])
        }
        break
      }
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const buildItems = useCallback(() => {
    const items = []
    courses.slice(0, 5).forEach((c) => items.push({ type: "course", ...c }))
    aiResults.slice(0, 3).forEach((r) => items.push({ type: "ai", ...r }))
    return items
  }, [courses, aiResults])

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsOpen(true)
    }
  }, [debouncedQuery])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [debouncedQuery])

  useEffect(() => {
    if (selectedIndex >= 0 && containerRef.current) {
      const el = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (el) el.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className="pl-12 h-12 text-base rounded-full"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => { if (debouncedQuery.trim()) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
        />
        {showLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 bg-card border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {courses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                    <BookOpen className="h-3.5 w-3.5" />
                    Courses ({courses.length})
                  </div>
                  {courses.slice(0, 5).map((course, i) => (
                    <button
                      key={course.id}
                      data-index={i}
                      onClick={() => handleSelect({ type: "course", ...course })}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                        selectedIndex === i ? "bg-accent" : "hover:bg-accent/50"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{course.title}</span>
                          <Badge variant={course.price === 0 ? "secondary" : "default"} className="shrink-0 text-[10px] px-1.5 py-0">
                            {course.price === 0 ? "Free" : `$${course.price}`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium">{course.rating || "—"}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{course.difficulty}</span>
                          {course.category && (
                            <span className="text-xs text-muted-foreground">{course.category}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showLoading && !hasResults && (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showLoading && !hasResults && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{debouncedQuery}"</p>
                </div>
              )}

              {aiResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 border-t">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Suggestions ({aiResults.length})
                  </div>
                  {aiResults.slice(0, 3).map((result, i) => {
                    const flatIndex = Math.min(courses.length, 5) + i
                    return (
                      <button
                        key={`ai-${i}`}
                        data-index={flatIndex}
                        onClick={() => handleSelect({ type: "ai", ...result })}
                        onMouseEnter={() => setSelectedIndex(flatIndex)}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                          selectedIndex === flatIndex ? "bg-accent" : "hover:bg-accent/50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{result.title}</span>
                            {result.score != null && (
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {(result.score * 100).toFixed(0)}% match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {result.description}
                          </p>
                          {result.level && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                                {result.level}
                              </span>
                            </div>
                          )}
                        </div>
                        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
