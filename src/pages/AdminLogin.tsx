import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple demo authentication - in real app, this would be proper authentication
    setTimeout(() => {
      if (email === 'admin@cleaningservice.com' && password === 'admin123') {
        navigate('/dashboard');
      } else {
        alert('Invalid credentials. Use admin@cleaningservice.com / admin123');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Admin Portal
              </h2>
              <div className="flex items-center justify-center space-x-1">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                  Secure Dashboard Access
                </p>
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-4 sm:space-y-6">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300/30 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="admin@cleaningservice.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300/30 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-white/10 rounded-r-lg sm:rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10 backdrop-blur-sm"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-200">
                    Remember me
                  </label>
                </div>
                <div className="text-xs sm:text-sm">
                  <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    ) : (
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 group-hover:text-blue-200 transition-colors duration-200" />
                    )}
                  </span>
                  <span className="flex items-center">
                    {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                    {!isLoading && <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2024 Cleaning Service. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}