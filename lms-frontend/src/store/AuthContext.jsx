import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { clearStoredAuth, getStoredAuth, persistAuth } from '../api/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStoredAuth();
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      setIsAuthLoading(true);
      authApi.validateToken(token)
        .then((data) => {
          const role = data.role || 'STUDENT';
          
          const userData = {
            token,
            email: data.email || '',
            role,
            permissions: data.permissions || [],
            userId: data.userId || data.sub || null,
          };
          
          persistAuth(userData);
          setUser(userData);
        })
        .catch(() => {
          clearStoredAuth();
          setUser(null);
        })
        .finally(() => setIsAuthLoading(false));
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setIsAuthLoading(true);
    try {
      const loginData = await authApi.login(email, password);
      persistAuth(loginData);
      setUser(loginData);
      return loginData;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setIsAuthLoading(true);
    try {
      const data = await authApi.register(formData);
      persistAuth(data);
      setUser(data);
      return data;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }, []);

  const hasPermission = useCallback((permission) => {
    if (user?.role === 'ADMIN') return true;
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasPermission, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
