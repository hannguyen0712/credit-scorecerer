import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

import {AuthService} from '../services/AuthService';
import {User} from '../types/User';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const {data: userData, isLoading: isUserLoading} = useQuery({
    queryKey: ['user'],
    queryFn: AuthService.getCurrentUser,
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const checkAuthStatus = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('authToken');
      if (credentials && credentials.password) {
        // Token exists, verify it's still valid
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.log('No stored credentials found');
    } finally {
      setIsLoading(false);
    }
  };

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      const {user: userData, token} = data;
      await Keychain.setInternetCredentials('authToken', 'token', token);
      setUser(userData);
      queryClient.setQueryData(['user'], userData);
    },
    onError: (error) => {
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: async (data) => {
      const {user: userData, token} = data;
      await Keychain.setInternetCredentials('authToken', 'token', token);
      setUser(userData);
      queryClient.setQueryData(['user'], userData);
    },
    onError: (error) => {
      throw error;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: AuthService.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['user'], updatedUser);
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({email, password});
  };

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      await Keychain.resetInternetCredentials('authToken');
      setUser(null);
      queryClient.clear();
    }
  };

  const forgotPassword = async (email: string) => {
    await AuthService.forgotPassword(email);
  };

  const updateProfile = async (userData: Partial<User>) => {
    await updateProfileMutation.mutateAsync(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isUserLoading,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

