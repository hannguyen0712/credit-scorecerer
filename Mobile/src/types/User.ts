export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    paymentReminders: boolean;
    creditScoreUpdates: boolean;
    spendingAlerts: boolean;
    educationalContent: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

