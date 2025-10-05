import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not found. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          issuer: string;
          card_number: string;
          credit_limit: number;
          current_balance: number;
          available_credit: number;
          interest_rate: number;
          minimum_payment: number;
          due_date: string;
          last_payment_date: string | null;
          last_payment_amount: number | null;
          is_active: boolean;
          rewards_type: 'cashback' | 'points' | 'miles';
          rewards_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          issuer: string;
          card_number: string;
          credit_limit: number;
          current_balance: number;
          available_credit: number;
          interest_rate: number;
          minimum_payment: number;
          due_date: string;
          last_payment_date?: string | null;
          last_payment_amount?: number | null;
          is_active?: boolean;
          rewards_type: 'cashback' | 'points' | 'miles';
          rewards_rate: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          issuer?: string;
          card_number?: string;
          credit_limit?: number;
          current_balance?: number;
          available_credit?: number;
          interest_rate?: number;
          minimum_payment?: number;
          due_date?: string;
          last_payment_date?: string | null;
          last_payment_amount?: number | null;
          is_active?: boolean;
          rewards_type?: 'cashback' | 'points' | 'miles';
          rewards_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          range_min: number;
          range_max: number;
          category: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
          last_updated: string;
          provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          range_min: number;
          range_max: number;
          category: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
          last_updated: string;
          provider: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          range_min?: number;
          range_max?: number;
          category?: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
          last_updated?: string;
          provider?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_history: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          amount: number;
          date: string;
          type: 'payment' | 'purchase' | 'interest' | 'fee';
          description: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          amount: number;
          date: string;
          type: 'payment' | 'purchase' | 'interest' | 'fee';
          description: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_id?: string;
          amount?: number;
          date?: string;
          type?: 'payment' | 'purchase' | 'interest' | 'fee';
          description?: string;
          category?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

