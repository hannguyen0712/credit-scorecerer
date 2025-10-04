import axios from 'axios';
import {User} from '../types/User';

const API_BASE_URL = 'https://api.aicreditoptimizer.com'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear stored credentials
      await clearStoredToken();
    }
    return Promise.reject(error);
  }
);

const getStoredToken = async (): Promise<string | null> => {
  try {
    const Keychain = require('react-native-keychain');
    const credentials = await Keychain.getInternetCredentials('authToken');
    return credentials ? credentials.password : null;
  } catch (error) {
    return null;
  }
};

const clearStoredToken = async (): Promise<void> => {
  try {
    const Keychain = require('react-native-keychain');
    await Keychain.resetInternetCredentials('authToken');
  } catch (error) {
    console.log('Error clearing token:', error);
  }
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthService = {
  async login({email, password}: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', {email, password});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch('/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', {email});
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      // Even if the API call fails, we should still clear local storage
      console.log('Logout API call failed:', error);
    }
  },
};
