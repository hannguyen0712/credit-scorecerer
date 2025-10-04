export interface Recommendation {
  id: string;
  type: 'payment' | 'usage' | 'timing' | 'optimization' | 'education';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: {
    creditScore: number; // Expected change in points
    savings: number; // Expected savings in dollars
    timeframe: string; // When to expect results
  };
  aiConfidence: number; // 0-100
  createdAt: string;
  expiresAt?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface SpendingCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  cardId: string;
  merchant: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

