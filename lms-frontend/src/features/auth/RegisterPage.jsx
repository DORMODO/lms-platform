import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Mail, Lock, GraduationCap, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/store/AuthContext"
import { useToast } from "@/context/ToastContext"

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[A-Z]/, text: "One uppercase letter" },
  { regex: /[0-9]/, text: "One number" },
]

const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be 50 characters or fewer"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
})

const dashboardByRole = {
  ADMIN: "/admin/dashboard",
  INSTRUCTOR: "/instructor/dashboard",
  STUDENT: "/student/dashboard",
}

export default function RegisterPage() {
  const [formError, setFormError] = useState("")
  const { register: registerUser } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "STUDENT",
    },
  })

  const password = useWatch({ control, name: "password" })

  const onSubmit = async (values) => {
    setFormError("")

    try {
      const userData = await registerUser(values)
      const role = userData?.role || values.role
      success("Account created! Welcome to LMS Platform.")
      navigate(dashboardByRole[role] || dashboardByRole.STUDENT)
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed"
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
          <h1 className="text-4xl font-bold mb-4">Join LMS Platform</h1>
          <p className="text-lg opacity-90">
            Create your account and start your learning journey today.
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
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-muted-foreground mt-2">Choose your role and secure your account</p>
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
              <Label htmlFor="role">I want to</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Learn new skills</SelectItem>
                      <SelectItem value="INSTRUCTOR">Teach courses</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
              </div>
              <Card className="mt-2">
                <CardContent className="p-3">
                  <p className="text-xs font-medium mb-2">Password requirements:</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => {
                      const passed = req.regex.test(password)

                      return (
                        <li key={req.text} className="flex items-center gap-2 text-xs">
                          {passed ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={passed ? "text-green-600" : "text-muted-foreground"}>
                            {req.text}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
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
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
