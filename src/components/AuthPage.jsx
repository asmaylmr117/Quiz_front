import React, { useState } from 'react';
import { User, GraduationCap, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://quiz-backend-rose.vercel.app';

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);
    
    try {
      let endpoint = isLogin ? '/auth/login' : '/auth/register';
      let payload = {
        ...formData,
        role: selectedRole,
      };

      // If admin registration and not login, use endpoint for checking first admin
      if (!isLogin && selectedRole === 'admin') {
        // Attempt to create first admin
        endpoint = '/setup/first-admin';
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        toast.success(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      } else {
        // If error is about existing admin, show specific message
        if (data.error?.includes('admin')) {
          toast.error(data.error);
        } else {
          toast.error(data.error || 'Something went wrong');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">QuizTime</h1>
            <p className="text-gray-200">Choose your role to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('admin')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <User size={24} />
              <span>Admin</span>
            </button>
            
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <GraduationCap size={24} />
              <span>Student</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={() => setSelectedRole('')}
            className="text-gray-300 hover:text-white mb-4 transition-colors duration-300"
          >
            ← Back to role selection
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-200">
            {selectedRole === 'admin' ? 'Admin' : 'Student'} {isLogin ? 'Login' : 'Registration'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Admin Registration Notice - Only show during admin registration */}
          {!isLogin && selectedRole === 'admin' && (
            <div className="border-2 border-red-500 border-opacity-50 rounded-lg p-4 bg-red-500 bg-opacity-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="text-red-200 font-semibold">Admin Registration Notice</h3>
              </div>
              <p className="text-red-200 text-sm leading-relaxed">
                Admin registration is restricted for security reasons. Only the first admin can be created during initial system setup. 
                After that, new admin accounts can only be created by existing administrators from within the admin dashboard.
              </p>
              <p className="text-red-300 text-xs mt-2 font-medium">
                If you need admin access, contact an existing system administrator.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                <span>{isLogin ? 'Login' : 'Sign Up'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;