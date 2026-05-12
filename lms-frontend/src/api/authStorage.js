const AUTH_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  email: "email",
  role: "role",
  permissions: "permissions",
  userId: "userId",
}

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const getStoredAuth = () => {
  const token = localStorage.getItem(AUTH_KEYS.token)
  if (!token) return null

  return {
    token,
    refreshToken: localStorage.getItem(AUTH_KEYS.refreshToken) || "",
    email: localStorage.getItem(AUTH_KEYS.email) || "",
    role: localStorage.getItem(AUTH_KEYS.role) || "",
    permissions: safeParse(localStorage.getItem(AUTH_KEYS.permissions), []),
    userId: localStorage.getItem(AUTH_KEYS.userId) || null,
  }
}

export const persistAuth = ({ token, refreshToken = "", email = "", role = "", permissions = [], userId = null }) => {
  localStorage.setItem(AUTH_KEYS.token, token)
  localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken)
  localStorage.setItem(AUTH_KEYS.email, email)
  localStorage.setItem(AUTH_KEYS.role, role)
  localStorage.setItem(AUTH_KEYS.permissions, JSON.stringify(permissions))
  localStorage.setItem(AUTH_KEYS.userId, userId || "")
}

export const updateAccessToken = (token, refreshToken) => {
  localStorage.setItem(AUTH_KEYS.token, token)
  if (refreshToken) localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken)
}

export const clearStoredAuth = () => {
  Object.values(AUTH_KEYS).forEach((key) => localStorage.removeItem(key))
  localStorage.removeItem("roles")
  localStorage.removeItem("lms-user-role")
}

export const getAccessToken = () => localStorage.getItem(AUTH_KEYS.token)
export const getRefreshToken = () => localStorage.getItem(AUTH_KEYS.refreshToken)
