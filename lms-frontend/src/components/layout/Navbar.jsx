import { Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ChevronDown, GraduationCap, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import RoleBadge from "@/components/common/RoleBadge"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/store/AuthContext"
import { useToast } from "@/context/ToastContext"

export function Navbar() {
  const { user, logout } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const isLoggedIn = Boolean(user)
  const role = user?.role || "STUDENT"
  const profilePath = `/${role.toLowerCase()}/profile`

  const handleLogout = () => {
    logout()
    success("Logged out successfully")
    navigate("/login")
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6"
    >
      <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="hidden sm:inline">LMS Platform</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {isLoggedIn ? (
          <>
            <NotificationBell />

            <RoleBadge role={role} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {user?.avatar && <AvatarImage src={user.avatar} />}
                    <AvatarFallback className={role === "ADMIN" ? "bg-destructive/15 text-destructive font-semibold text-sm" : role === "INSTRUCTOR" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold text-sm" : "bg-green-500/15 text-green-600 dark:text-green-400 font-semibold text-sm"}>
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(profilePath)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  )
}
