import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, CheckCircle, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Skeleton from "@/components/common/Skeleton"
import { useAuth } from "@/store/AuthContext"
import { useCourse, usePay } from "@/hooks/apiHooks"
import { useToast } from "@/context/ToastContext"
import CourseThumbnail from "@/components/common/CourseThumbnail"

export default function CheckoutPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const courseQuery = useCourse(courseId)
  const payMutation = usePay()
  const [paymentResult, setPaymentResult] = useState(null)

  const course = courseQuery.data
  const isFree = course?.price === 0

  const handlePay = async () => {
    try {
      const result = await payMutation.mutateAsync({ courseId, amount: course.price })
      setPaymentResult(result)
      success(`Payment successful! Receipt: ${result.receiptNumber}`)
    } catch (err) {
      showError(err.response?.data?.error || err.message || "Payment failed")
    }
  }

  if (courseQuery.isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="font-semibold">Course not found</p>
        <Button asChild className="mt-4">
          <Link to="/student/courses">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  if (paymentResult) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">You are now enrolled in <strong>{course.title}</strong></p>
        <Card className="text-left">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span>Receipt: {paymentResult.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">${course.price.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction</span>
              <span className="font-mono text-xs">{paymentResult.transactionRef}</span>
            </div>
          </CardContent>
        </Card>
        <Button size="lg" onClick={() => navigate(`/student/courses/${courseId}`, { replace: true })}>
          Go to Course
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to={`/student/courses/${course.id}`}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Course
        </Link>
      </Button>

      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          {isFree ? (
            <Card>
              <CardHeader>
                <CardTitle>Free Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">This course is free</p>
                    <p className="text-sm text-muted-foreground">You will be enrolled immediately at no cost.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Confirm Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Pay with Credit Card</p>
                    <p className="text-sm text-muted-foreground">Your payment will be processed securely.</p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePay}
                  disabled={payMutation.isPending}
                >
                  {payMutation.isPending ? "Processing..." : `Pay $${course.price.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-14 w-20 rounded bg-muted overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <CourseThumbnail title={course.title} category={course.category} className="w-full h-full" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm leading-tight">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.category}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span>{isFree ? "Free" : `$${course.price.toFixed(2)}`}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{isFree ? "Free" : `$${course.price.toFixed(2)}`}</span>
              </div>

              {isFree && (
                <Button className="w-full" size="lg" onClick={() => navigate(`/student/courses/${courseId}`, { replace: true })}>
                  Enroll for Free
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
