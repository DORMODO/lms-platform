import AppRouter from './routes/AppRouter'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './store/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { Toaster } from 'sonner'
import { queryClient } from './lib/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="lms-theme">
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
            <Toaster richColors position="top-right" />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
