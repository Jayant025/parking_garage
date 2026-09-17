import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Operator Pages
import { DashboardPage } from '../pages/DashboardPage';
import { CheckInPage } from '../pages/CheckInPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import { SpotsPage } from '../pages/SpotsPage';
import { SearchPage } from '../pages/SearchPage';
import { HistoryPage } from '../pages/HistoryPage';
import { PricingPage } from '../pages/PricingPage';
import { ReportsPage } from '../pages/ReportsPage';
import { GaragePage } from '../pages/GaragePage';
import { OperatorSupportPage } from '../pages/OperatorSupportPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';

// Auth Pages
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

// Customer Pages
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { CustomerSpotsPage } from '../pages/customer/CustomerSpotsPage';
import { CustomerPricingPage } from '../pages/customer/CustomerPricingPage';
import { CustomerSupportPage } from '../pages/customer/CustomerSupportPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Unauthenticated Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Customer Routes — Protected for Customer / User roles */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['customer', 'user']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/customer" element={<CustomerDashboardPage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
        <Route path="/customer/spots" element={<CustomerSpotsPage />} />
        <Route path="/customer/pricing" element={<CustomerPricingPage />} />
        <Route path="/customer/support" element={<CustomerSupportPage />} />
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Operator Routes — Protected for Operator / Admin / Attendant roles */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['operator', 'admin', 'attendant']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/check-out" element={<CheckOutPage />} />
        <Route path="/spots" element={<SpotsPage />} />
        <Route path="/garage/spots" element={<SpotsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/support" element={<OperatorSupportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
