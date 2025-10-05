import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginProps {
  onSwitchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignUp }) => {
  const { isDark } = useTheme();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    });
    
    try {
      await login({
        email: 'demo@example.com',
        password: 'demo123'
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md glass rounded-2xl p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Sign in to your Credit Scorecerer account
          </p>
        </div>

        {/* Demo Login Button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full mb-6 btn-secondary py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Try Demo Account'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDark ? 'border-white/20' : 'border-gray-300'}`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${isDark ? 'bg-gray-900 text-white/60' : 'bg-white text-gray-500'}`}>
              Or sign in with your account
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border-0 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isDark 
                    ? 'bg-white/10 text-white placeholder-white/50' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-12 py-3 border-0 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isDark 
                    ? 'bg-white/10 text-white placeholder-white/50' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-white/20' : 'border-gray-300'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDark ? 'bg-gray-900 text-white/60' : 'bg-white text-gray-500'}`}>
                Demo Accounts
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => login({ email: 'demo@example.com', password: 'demo123' })}
              className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                isDark
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isLoading}
            >
              Demo User (demo@example.com)
            </button>
            <button
              onClick={() => login({ email: 'john.doe@example.com', password: 'demo123' })}
              className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                isDark
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isLoading}
            >
              John Doe (john.doe@example.com)
            </button>
            <button
              onClick={() => login({ email: 'jane.smith@example.com', password: 'demo123' })}
              className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                isDark
                  ? 'bg-white/10 text-white/80 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isLoading}
            >
              Jane Smith (jane.smith@example.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
