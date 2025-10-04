import axios from 'axios';
import {CreditScore, CreditCard, PaymentHistory, CreditUtilization} from '../types/Credit';

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

export const CreditService = {
  async getCreditScore(): Promise<CreditScore> {
    try {
      const response = await api.get('/credit/score');
      return response.data;
    } catch (error: any) {
      // Return mock data for development
      return {
        score: 720,
        range: {min: 300, max: 850},
        category: 'Good',
        lastUpdated: new Date().toISOString(),
        provider: 'Experian',
      };
    }
  },

  async getCreditCards(): Promise<CreditCard[]> {
    try {
      const response = await api.get('/credit/cards');
      return response.data;
    } catch (error: any) {
      // Return mock data for development
      return [
        {
          id: '1',
          name: 'Chase Freedom Unlimited',
          issuer: 'Chase',
          cardNumber: '**** 1234',
          creditLimit: 5000,
          currentBalance: 1200,
          availableCredit: 3800,
          interestRate: 18.99,
          minimumPayment: 25,
          dueDate: '2024-01-15',
          lastPaymentDate: '2023-12-15',
          lastPaymentAmount: 500,
          isActive: true,
          rewards: {
            type: 'cashback',
            rate: 1.5,
          },
        },
        {
          id: '2',
          name: 'Capital One Venture',
          issuer: 'Capital One',
          cardNumber: '**** 5678',
          creditLimit: 8000,
          currentBalance: 2400,
          availableCredit: 5600,
          interestRate: 19.99,
          minimumPayment: 50,
          dueDate: '2024-01-20',
          lastPaymentDate: '2023-12-20',
          lastPaymentAmount: 300,
          isActive: true,
          rewards: {
            type: 'miles',
            rate: 2,
          },
        },
      ];
    }
  },

  async getPaymentHistory(cardId?: string): Promise<PaymentHistory[]> {
    try {
      const url = cardId ? `/credit/payments?cardId=${cardId}` : '/credit/payments';
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      // Return mock data for development
      return [
        {
          id: '1',
          cardId: '1',
          amount: 500,
          date: '2023-12-15',
          type: 'payment',
          description: 'Payment received',
        },
        {
          id: '2',
          cardId: '1',
          amount: 150,
          date: '2023-12-10',
          type: 'purchase',
          description: 'Grocery store purchase',
          category: 'Food',
        },
      ];
    }
  },

  async getCreditUtilization(): Promise<CreditUtilization[]> {
    try {
      const response = await api.get('/credit/utilization');
      return response.data;
    } catch (error: any) {
      // Return mock data for development
      return [
        {
          cardId: '1',
          utilization: 24,
          recommendedAction: 'Keep utilization below 30%',
          impactOnScore: 'positive',
        },
        {
          cardId: '2',
          utilization: 30,
          recommendedAction: 'Consider paying down balance',
          impactOnScore: 'neutral',
        },
      ];
    }
  },

  async getSpendingData(): Promise<any> {
    try {
      const response = await api.get('/credit/spending');
      return response.data;
    } catch (error: any) {
      // Return mock data for development
      return {
        totalSpent: 3500,
        budget: 4000,
        categories: [
          {
            name: 'Food & Dining',
            spent: 800,
            budget: 1000,
            color: '#FF6B6B',
          },
          {
            name: 'Transportation',
            spent: 600,
            budget: 800,
            color: '#4ECDC4',
          },
          {
            name: 'Shopping',
            spent: 1200,
            budget: 1000,
            color: '#45B7D1',
          },
          {
            name: 'Entertainment',
            spent: 400,
            budget: 500,
            color: '#96CEB4',
          },
          {
            name: 'Bills & Utilities',
            spent: 500,
            budget: 700,
            color: '#FFEAA7',
          },
        ],
        utilization: {
          overall: 25,
          byCard: [
            {
              cardId: '1',
              cardName: 'Chase Freedom',
              utilization: 24,
            },
            {
              cardId: '2',
              cardName: 'Capital One Venture',
              utilization: 30,
            },
          ],
        },
      };
    }
  },

  async makePayment(cardId: string, amount: number): Promise<void> {
    try {
      await api.post('/credit/payments', {cardId, amount});
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment failed');
    }
  },

  async updateCreditCard(cardId: string, updates: Partial<CreditCard>): Promise<CreditCard> {
    try {
      const response = await api.patch(`/credit/cards/${cardId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update card');
    }
  },
};

