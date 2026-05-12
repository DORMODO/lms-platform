import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FileText,
  CreditCard,
  Shield,
  BarChart3,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/store/AuthContext"

const menuItems = {
  ADMIN: [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { path: "/admin/users", icon: Users, label: "Users", badge: null },
    { path: "/admin/roles", icon: Shield, label: "Roles", badge: null },
    { path: "/admin/payments", icon: CreditCard, label: "Payments", badge: null },
    { path: "/admin/audit", icon: FileText, label: "Audit Logs", badge: null },
  ],
  INSTRUCTOR: [
    { path: "/instructor/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { path: "/instructor/courses", icon: BookOpen, label: "My Courses", badge: null },
    { path: "/instructor/students", icon: Users, label: "Students", badge: null },
    { path: "/instructor/earnings", icon: DollarSign, label: "Earnings", badge: null },
    { path: "/instructor/analytics", icon: BarChart3, label: "Analytics", badge: "New" },
  ],
  STUDENT: [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { path: "/student/courses", icon: BookOpen, label: "My Courses", badge: null },
    { path: "/student/payments", icon: CreditCard, label: "Payments", badge: null },
  ],
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="h-screen w-64 bg-card border-r flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const role = user?.role || "STUDENT"
  const items = menuItems[role] || menuItems.STUDENT

  return (
    <motion.div
      className={cn("h-screen bg-card border-r flex flex-col", collapsed ? "w-16" : "w-64")}
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">LMS Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors relative",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-accent",
                collapsed && "justify-center"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && item.badge && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>


    </motion.div>
  )
}
