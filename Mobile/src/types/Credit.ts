export interface CreditScore {
  score: number;
  range: {
    min: number;
    max: number;
  };
  category: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
  lastUpdated: string;
  provider: string;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  cardNumber: string; // Masked
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  isActive: boolean;
  rewards: {
    type: 'cashback' | 'points' | 'miles';
    rate: number;
    categories?: string[];
  };
}

export interface PaymentHistory {
  id: string;
  cardId: string;
  amount: number;
  date: string;
  type: 'payment' | 'purchase' | 'interest' | 'fee';
  description: string;
  category?: string;
}

export interface CreditUtilization {
  cardId: string;
  utilization: number; // Percentage
  recommendedAction: string;
  impactOnScore: 'positive' | 'neutral' | 'negative';
}

