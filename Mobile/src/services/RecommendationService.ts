import axios from 'axios';
import {Recommendation} from '../types/Recommendation';

const API_BASE_URL = 'https://api.aicreditoptimizer.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const Keychain = require('react-native-keychain');
    const credentials = await Keychain.getInternetCredentials('authToken');
    if (credentials && credentials.password) {
      config.headers.Authorization = `Bearer ${credentials.password}`;
    }
  } catch (error) {
    console.log('Error getting token:', error);
  }
  return config;
});

export const RecommendationService = {
  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const response = await api.get('/recommendations');
      return response.data;
    } catch (error: any) {
      // Return mock data for development
      return [
        {
          id: '1',
          type: 'payment',
          priority: 'high',
          title: 'Pay Down High Utilization Card',
          description: 'Your Capital One Venture card has 30% utilization. Paying it down to under 30% could improve your credit score.',
          action: 'Pay $200 Now',
          impact: {
            creditScore: 15,
            savings: 45,
            timeframe: '1-2 months',
          },
          aiConfidence: 92,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        },
        {
          id: '2',
          type: 'timing',
          priority: 'medium',
          title: 'Optimize Payment Timing',
          description: 'Make your payment 3 days before the due date to ensure it posts on time and improves your payment history.',
          action: 'Set Auto-Pay',
          impact: {
            creditScore: 8,
            savings: 0,
            timeframe: 'Immediate',
          },
          aiConfidence: 87,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        },
        {
          id: '3',
          type: 'usage',
          priority: 'low',
          title: 'Maximize Rewards on Groceries',
          description: 'Use your Chase Freedom card for grocery purchases to earn 1.5% cashback instead of your current card.',
          action: 'Switch Card Usage',
          impact: {
            creditScore: 0,
            savings: 25,
            timeframe: 'Monthly',
          },
          aiConfidence: 95,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        },
        {
          id: '4',
          type: 'education',
          priority: 'medium',
          title: 'Learn About Credit Utilization',
          description: 'Understanding how credit utilization affects your score can help you make better financial decisions.',
          action: 'Read Article',
          impact: {
            creditScore: 0,
            savings: 0,
            timeframe: 'Ongoing',
          },
          aiConfidence: 100,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        },
      ];
    }
  },

  async getRecommendationById(id: string): Promise<Recommendation> {
    try {
      const response = await api.get(`/recommendations/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get recommendation');
    }
  },

  async markRecommendationCompleted(id: string): Promise<void> {
    try {
      await api.patch(`/recommendations/${id}/complete`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark as completed');
    }
  },

  async getPersonalizedRecommendations(): Promise<Recommendation[]> {
    try {
      const response = await api.get('/recommendations/personalized');
      return response.data;
    } catch (error: any) {
      // Return mock personalized recommendations
      return [
        {
          id: '5',
          type: 'optimization',
          priority: 'high',
          title: 'Consider Balance Transfer',
          description: 'Transfer your high-interest balance to a 0% APR card to save on interest and pay down debt faster.',
          action: 'Apply for Transfer',
          impact: {
            creditScore: 5,
            savings: 180,
            timeframe: '3-6 months',
          },
          aiConfidence: 78,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        },
      ];
    }
  },

  async getEducationalContent(): Promise<any[]> {
    try {
      const response = await api.get('/recommendations/education');
      return response.data;
    } catch (error: any) {
      // Return mock educational content
      return [
        {
          id: '1',
          title: 'Understanding Credit Scores',
          description: 'Learn how credit scores are calculated and what factors affect them.',
          category: 'Credit Basics',
          readTime: '5 min',
          difficulty: 'Beginner',
        },
        {
          id: '2',
          title: 'Credit Utilization Strategies',
          description: 'Master the art of keeping your credit utilization low for better scores.',
          category: 'Advanced Tips',
          readTime: '8 min',
          difficulty: 'Intermediate',
        },
      ];
    }
  },

  async submitFeedback(recommendationId: string, feedback: {
    helpful: boolean;
    comments?: string;
  }): Promise<void> {
    try {
      await api.post(`/recommendations/${recommendationId}/feedback`, feedback);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit feedback');
    }
  },
};

