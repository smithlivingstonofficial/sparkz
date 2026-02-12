import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import ProShowPage from './pages/ProShowPage';
import SponsorsPage from './pages/SponsorsPage';
import HospitalityPage from './pages/HospitalityPage';
import TeamPage from './pages/TeamPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage'; // <-- NEW IMPORT
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// Layout wrapper for AppLayout routes
const AppLayoutWrapper = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
          {/* Routes wrapped with AppLayout */}
          <Route element={<AppLayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/proshow" element={<ProShowPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/hospitality" element={<HospitalityPage />} />
            <Route path="/teams" element={<TeamPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* <-- NEW ROUTE */}
          </Route>
          
          {/* Auth routes with their own layout */}
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* 404 Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </Router>
    </CartProvider>
  </AuthProvider>
  );
}

export default App;