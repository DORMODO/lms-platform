import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Mail, Lock, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/store/AuthContext"
import { useToast } from "@/context/ToastContext"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

const dashboardByRole = {
  ADMIN: "/admin/dashboard",
  INSTRUCTOR: "/instructor/dashboard",
  STUDENT: "/student/dashboard",
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")
  const { login } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async ({ email, password }) => {
    setFormError("")

    try {
      const userData = await login(email, password)
      const role = userData?.role || "STUDENT"
      success("Welcome back! You have successfully logged in.")
      navigate(dashboardByRole[role] || dashboardByRole.STUDENT)
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Invalid credentials"
      setFormError(message)
      showError(message)
    }
  }

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12"
      >
        <div className="max-w-md text-white">
          <GraduationCap className="h-16 w-16 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Welcome Back to LMS Platform</h1>
          <p className="text-lg opacity-90">
            Sign in to continue your learning journey or manage your courses.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-md"
              >
                {formError}
              </motion.div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
