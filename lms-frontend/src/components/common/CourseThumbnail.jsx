import { useMemo } from "react"

const categoryColors = {
  Programming: { from: "#4F46E5", to: "#7C3AED" },
  "Web Development": { from: "#2563EB", to: "#06B6D4" },
  "Data Science": { from: "#059669", to: "#10B981" },
  Science: { from: "#0284C7", to: "#38BDF8" },
  Cloud: { from: "#6366F1", to: "#818CF8" },
  Finance: { from: "#D97706", to: "#F59E0B" },
  Design: { from: "#8B5CF6", to: "#A78BFA" },
  Business: { from: "#1E40AF", to: "#3B82F6" },
  Marketing: { from: "#DC2626", to: "#F87171" },
  Health: { from: "#059669", to: "#34D399" },
  Security: { from: "#6B7280", to: "#9CA3AF" },
  "Mobile Development": { from: "#6366F1", to: "#8B5CF6" },
  DevOps: { from: "#EA580C", to: "#F97316" },
  Engineering: { from: "#1D4ED8", to: "#60A5FA" },
  Mathematics: { from: "#7C3AED", to: "#A78BFA" },
  Psychology: { from: "#BE185D", to: "#EC4899" },
  Humanities: { from: "#B45309", to: "#D97706" },
  "Personal Development": { from: "#0D9488", to: "#14B8A6" },
  Communication: { from: "#0369A1", to: "#0EA5E9" },
  Arts: { from: "#BE123C", to: "#E11D48" },
  Economics: { from: "#92400E", to: "#D97706" },
}

const defaultColor = { from: "#6366F1", to: "#8B5CF6" }

export default function CourseThumbnail({ title = "", category = "", className = "" }) {
  const initials = useMemo(() => {
    const words = title.split(" ").filter(Boolean)
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
    return title.slice(0, 2).toUpperCase()
  }, [title])

  const colors = categoryColors[category] || defaultColor

  const svg = useMemo(() => {
    const gradientId = `g-${title.replace(/\s+/g, "")}-${category}`
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.from}" />
          <stop offset="100%" stop-color="${colors.to}" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#${gradientId})" />
      <text x="300" y="200" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, sans-serif" font-weight="700" font-size="120"
        fill="rgba(255,255,255,0.25)" letter-spacing="4">${initials}</text>
    </svg>`)}`
  }, [title, category, initials, colors])

  return (
    <div className={`bg-muted overflow-hidden ${className}`}>
      <img src={svg} alt={title} className="w-full h-full object-cover" />
    </div>
  )
}
