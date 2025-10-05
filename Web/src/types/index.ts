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

export interface SpendingData {
  totalSpent: number;
  budget: number;
  categories: {
    name: string;
    spent: number;
    budget: number;
    color: string;
  }[];
  utilization: {
    overall: number;
    byCard: {
      cardId: string;
      cardName: string;
      utilization: number;
    }[];
  };
}

export interface AIConsultationRequest {
  purchaseAmount: number;
  purchaseCategory: string;
  description: string;
  preferredCard?: string;
}

export interface AIConsultationResponse {
  recommendation: {
    recommendedCard: string;
    reasoning: string;
    creditImpact: 'positive' | 'neutral' | 'negative';
    impactExplanation: string;
  };
  alternatives: {
    cardId: string;
    cardName: string;
    pros: string[];
    cons: string[];
  }[];
  tips: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  creditScore: CreditScore;
  creditCards: CreditCard[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

