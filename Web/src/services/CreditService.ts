import { CreditScore, CreditCard, PaymentHistory, CreditUtilization, SpendingData } from '../types';

class CreditService {
  // Mock data - in a real app, this would come from an API
  private mockCreditScore: CreditScore = {
    score: 720,
    range: { min: 300, max: 850 },
    category: 'Good',
    lastUpdated: new Date().toISOString(),
    provider: 'Experian',
  };

  private mockCreditCards: CreditCard[] = [
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
    {
      id: '3',
      name: 'American Express Gold',
      issuer: 'American Express',
      cardNumber: '**** 9012',
      creditLimit: 10000,
      currentBalance: 3200,
      availableCredit: 6800,
      interestRate: 20.99,
      minimumPayment: 80,
      dueDate: '2024-01-25',
      lastPaymentDate: '2023-12-25',
      lastPaymentAmount: 400,
      isActive: true,
      rewards: {
        type: 'points',
        rate: 4,
        categories: ['dining', 'groceries'],
      },
    },
  ];

  private mockPaymentHistory: PaymentHistory[] = [
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
    {
      id: '3',
      cardId: '2',
      amount: 300,
      date: '2023-12-20',
      type: 'payment',
      description: 'Payment received',
    },
    {
      id: '4',
      cardId: '2',
      amount: 200,
      date: '2023-12-18',
      type: 'purchase',
      description: 'Gas station',
      category: 'Transportation',
    },
  ];

  async getCreditScore(): Promise<CreditScore> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockCreditScore;
  }

  async getCreditCards(): Promise<CreditCard[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockCreditCards;
  }

  async getPaymentHistory(cardId?: string): Promise<PaymentHistory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (cardId) {
      return this.mockPaymentHistory.filter(payment => payment.cardId === cardId);
    }
    return this.mockPaymentHistory;
  }

  async getCreditUtilization(): Promise<CreditUtilization[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockCreditCards.map(card => ({
      cardId: card.id,
      utilization: (card.currentBalance / card.creditLimit) * 100,
      recommendedAction: this.getUtilizationRecommendation(card.currentBalance, card.creditLimit),
      impactOnScore: this.getUtilizationImpact(card.currentBalance, card.creditLimit),
    }));
  }

  async getSpendingData(): Promise<SpendingData> {
    await new Promise(resolve => setTimeout(resolve, 300));
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
        byCard: this.mockCreditCards.map(card => ({
          cardId: card.id,
          cardName: card.name,
          utilization: (card.currentBalance / card.creditLimit) * 100,
        })),
      },
    };
  }

  async makePayment(cardId: string, amount: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const card = this.mockCreditCards.find(c => c.id === cardId);
    if (card) {
      card.currentBalance = Math.max(0, card.currentBalance - amount);
      card.availableCredit = card.creditLimit - card.currentBalance;
      card.lastPaymentDate = new Date().toISOString();
      card.lastPaymentAmount = amount;
    }
  }

  async updateCreditCard(cardId: string, updates: Partial<CreditCard>): Promise<CreditCard> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cardIndex = this.mockCreditCards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      this.mockCreditCards[cardIndex] = { ...this.mockCreditCards[cardIndex], ...updates };
      return this.mockCreditCards[cardIndex];
    }
    throw new Error('Credit card not found');
  }

  private getUtilizationRecommendation(balance: number, limit: number): string {
    const utilization = (balance / limit) * 100;
    if (utilization > 30) {
      return 'Consider paying down balance to improve credit score';
    } else if (utilization > 10) {
      return 'Good utilization rate, maintain current level';
    } else {
      return 'Excellent utilization rate';
    }
  }

  private getUtilizationImpact(balance: number, limit: number): 'positive' | 'neutral' | 'negative' {
    const utilization = (balance / limit) * 100;
    if (utilization > 30) return 'negative';
    if (utilization > 10) return 'neutral';
    return 'positive';
  }
}

export default new CreditService();


