import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Star, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import Skeleton from "@/components/common/Skeleton"
import { useAuth } from "@/store/AuthContext"
import { useToast } from "@/context/ToastContext"
import {
  useCourseReviews,
  useCourseReviewSummary,
  useCreateReview,
  useDeleteReview,
} from "@/hooks/apiHooks"

function StarRating({ value, onChange, readonly = false, size = "sm" }) {
  const [hover, setHover] = useState(0)
  const sizeClass = size === "lg" ? "h-6 w-6" : "h-4 w-4"

  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? undefined : "button"}
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </span>
  )
}

export default function CourseReviews({ courseId }) {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const isLoggedIn = Boolean(user)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const reviewsQuery = useCourseReviews(courseId)
  const summaryQuery = useCourseReviewSummary(courseId)
  const createReview = useCreateReview()
  const deleteReview = useDeleteReview()

  const reviews = reviewsQuery.data || []
  const summary = summaryQuery.data
  const isStudent = user?.role === "STUDENT"

  const userReview = reviews.find((r) => r.studentId === Number(user?.id))
  const hasReviewed = Boolean(userReview)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating || !comment.trim()) return

    createReview.mutate(
      { courseId, payload: { rating, comment } },
      {
        onSuccess: () => {
          success("Review submitted successfully!")
          setShowForm(false)
          setRating(0)
          setComment("")
        },
        onError: (err) => showError(err.message || "Failed to submit review"),
      }
    )
  }

  const handleDelete = (reviewId) => {
    deleteReview.mutate(
      { reviewId, courseId },
      {
        onSuccess: () => success("Review deleted"),
        onError: (err) => showError(err.message || "Failed to delete review"),
      }
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews
            {summary && (
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({summary.totalReviews})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {summaryQuery.isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {summary && summary.totalReviews > 0 && (
            <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
              <div className="text-center sm:text-left">
                <div className="text-4xl font-bold">{summary.averageRating}</div>
                <StarRating value={Math.round(summary.averageRating)} readonly />
                <div className="text-sm text-muted-foreground mt-1">
                  {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.ratingDistribution[star] || 0
                  const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-right text-muted-foreground">{star}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground text-xs">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {summary && summary.totalReviews === 0 && !showForm && (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No reviews yet.</p>
            </div>
          )}

          {isLoggedIn && isStudent && !hasReviewed && !showForm && (
            <Button variant="outline" onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Star className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium block mb-1">Rating</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!rating || !comment.trim() || createReview.isPending}>
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setRating(0); setComment("") }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {reviewsQuery.isLoading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <div className="space-y-4">
              <Separator />
              {reviews.map((review) => {
                const isOwner = Number(user?.id) === review.studentId
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {review.studentName?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{review.studentName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {isOwner && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <StarRating value={review.rating} readonly />
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <Separator className="mt-4" />
                  </motion.div>
                )
              })}
            </div>
          )}

          {reviewsQuery.isError && (
            <p className="text-sm text-destructive">
              {reviewsQuery.error?.message || "Could not load reviews."}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
