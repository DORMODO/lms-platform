import { Bell, BookOpen, CheckCheck, CreditCard, GraduationCap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from "@/hooks/apiHooks"

const TYPE_ICONS = {
  ENROLLMENT: GraduationCap,
  PAYMENT: CreditCard,
  COURSE: BookOpen,
  REVIEW: Star,
}

function timeAgo(dateString) {
  const now = Date.now()
  const date = new Date(dateString)
  const diffMs = now - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return "just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

export function NotificationBell() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { data: unreadCount = 0 } = useUnreadCount()
  const { mutate: markAsRead } = useMarkAsRead()
  const { mutate: markAllAsRead } = useMarkAllAsRead()

  const topNotifications = notifications.slice(0, 10)
  const hasUnread = unreadCount > 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-semibold">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1.5 text-muted-foreground font-normal">({unreadCount})</span>
            )}
          </span>
          {hasUnread && (
            <Button variant="ghost" size="sm" className="h-auto text-xs gap-1 px-2 py-1" onClick={() => markAllAsRead()}>
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : topNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-40" />
              No notifications
            </div>
          ) : (
            <div className="py-1">
              {topNotifications.map((notification) => {
                const Icon = TYPE_ICONS[notification.type] || Bell
                return (
                  <button
                    key={notification.id}
                    onClick={() => { if (!notification.read) markAsRead(notification.id) }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-accent ${!notification.read ? "bg-accent/50" : ""}`}
                  >
                    <div className={`mt-0.5 rounded-full p-1.5 ${!notification.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`${!notification.read ? "font-semibold" : "text-muted-foreground"}`}>
                        {notification.title}
                      </div>
                      {notification.body && (
                        <div className="text-muted-foreground truncate mt-0.5">
                          {notification.body}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground/60 mt-0.5">
                        {timeAgo(notification.createdAt)}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
