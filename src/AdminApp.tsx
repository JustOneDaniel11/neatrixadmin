import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { SupabaseDataProvider } from './contexts/SupabaseDataContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function AdminApp() {
  return (
    <DarkModeProvider>
      <SupabaseDataProvider>
        <AdminProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AdminProvider>
      </SupabaseDataProvider>
    </DarkModeProvider>
  );
}

export default AdminApp;