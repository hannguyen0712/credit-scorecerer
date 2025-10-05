import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDark } = useTheme();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`glass rounded-2xl p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login/signup (handled by parent component)
  if (!isAuthenticated) {
    return null; // Parent component will handle showing auth forms
  }

  // If authenticated, render protected content
  return <>{children}</>;
};

export default AuthGuard;

