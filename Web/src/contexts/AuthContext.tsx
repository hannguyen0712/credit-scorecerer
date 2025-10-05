import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, SignUpRequest, AuthState } from '../types';
import AuthService from '../services/AuthService';

interface AuthContextType extends AuthState {
  login: (request: LoginRequest) => Promise<void>;
  signUp: (request: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current user (Supabase handles session management automatically)
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // For Supabase, we don't need to manually manage tokens
          // Supabase handles this automatically
          setToken('supabase-managed');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (request: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(request);
      setUser(response.user);
      setToken(response.token || 'supabase-managed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (request: SignUpRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.signUp(request);
      setUser(response.user);
      setToken(response.token || 'supabase-managed');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const newToken = await AuthService.refreshToken();
      if (newToken) {
        setToken(newToken);
      } else {
        // Token refresh failed, logout user
        await logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signUp,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
