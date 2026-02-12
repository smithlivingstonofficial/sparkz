// pages/AuthPage.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AuthSelection from '../features/auth/AuthSelection';
import KareLogin from '../features/auth/KareLogin';
import ExternalLogin from '../features/auth/ExternalLogin';
import ExternalRegister from '../features/auth/ExternalRegister';
import KareRegister from '../features/auth/KareRegister';

const AuthPage = () => {
  return (
    <AuthLayout>
      {/* Animated Background Effects for Auth Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-30 w-full">
        <Routes>
          <Route index element={<AuthSelection />} />
          <Route path="kare/login" element={<KareLogin />} />
          <Route path="kare/register" element={<KareRegister />} />
          <Route path="external/login" element={<ExternalLogin />} />
          <Route path="external/register" element={<ExternalRegister />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </AuthLayout>
  );
};

export default AuthPage;