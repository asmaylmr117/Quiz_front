import React from 'react';
import { Toaster } from 'react-hot-toast';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!user) {
    return <AuthPage />;
  }
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  
  return <StudentDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;