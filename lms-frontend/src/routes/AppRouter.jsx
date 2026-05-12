import { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../utils/constants';

import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import DashboardLayout from '../layouts/DashboardLayout';

import AdminDashboard from '../features/dashboard/AdminDashboard';
import InstructorDashboard from '../features/dashboard/InstructorDashboard';
import StudentDashboard from '../features/dashboard/StudentDashboard';
import UserProfile from '../features/profile/UserProfile';
import AuditLogsPage from '../features/audit/AuditLogsPage';
import UserManagement from '../features/dashboard/UserManagement';
import RolePermissionsManagement from '../features/dashboard/RolePermissionsManagement';

import CourseList from '../features/courses/CourseList';
import CourseDetail from '../features/courses/CourseDetail';
import LearningInterface from '../features/learning/LearningInterface';
import CheckoutPage from '../features/payments/CheckoutPage';
import PaymentPage from '../features/payments/PaymentPage';
import AdminPaymentPage from '../features/payments/AdminPaymentPage';
import InstructorPaymentPage from '../features/payments/InstructorPaymentPage';

const LogoutHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = () => navigate('/login', { replace: true });
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [navigate]);
  return null;
};

const AppRouter = () => (
  <BrowserRouter>
    <LogoutHandler />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RolePermissionsManagement />} />
        <Route path="payments" element={<AdminPaymentPage />} />
        <Route path="audit" element={<AuditLogsPage />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="/instructor" element={
        <RoleBasedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
          <DashboardLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="earnings" element={<InstructorPaymentPage />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="/student" element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <DashboardLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="learn/:courseId/:lessonId" element={<LearningInterface />} />
        <Route path="checkout/:courseId" element={<CheckoutPage />} />
        <Route path="payments" element={<PaymentPage />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">403</h1>
            <p className="text-gray-500 mt-2">Access Denied</p>
          </div>
        </div>
      } />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
