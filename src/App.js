import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import FloatingShapes from './components/FloatingShapes';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const SignIn = lazy(() => import('./components/auth/SignIn'));
const SignUp = lazy(() => import('./components/auth/SignUp'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const TherapistSelection = lazy(() => import('./components/TherapistSelection'));
const BookingFlow = lazy(() => import('./components/BookingFlow'));
const Profile = lazy(() => import('./components/Profile'));
const BookingHistory = lazy(() => import('./components/BookingHistory'));
const VideoCall = lazy(() => import('./components/VideoCall'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400">
    <LoadingSpinner size="large" />
  </div>
);

// Main App Routes
const AppRoutes = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <PageLoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-x-hidden">
      {/* Floating background shapes */}
      <FloatingShapes />
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        <Route 
          path="/signin" 
          element={currentUser ? <Navigate to="/dashboard" /> : <SignIn />} 
        />
        <Route 
          path="/signup" 
          element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/therapists" 
          element={
            <ProtectedRoute>
              <TherapistSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/book/:therapistId" 
          element={
            <ProtectedRoute>
              <BookingFlow />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/call/:bookingId"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
