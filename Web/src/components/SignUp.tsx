import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin }) => {
  const { isDark } = useTheme();
  const { signUp, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md glass rounded-2xl p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Join Credit Scorecerer and take control of your credit
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={`h-5 w-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border-0 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isDark 
                    ? 'bg-white/10 text-white placeholder-white/50' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your full name"
              />
            </div>
          </div>

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
                placeholder="Create a password (min. 6 characters)"
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-12 py-3 border-0 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isDark 
                    ? 'bg-white/10 text-white placeholder-white/50' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
