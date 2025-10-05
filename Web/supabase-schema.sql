-- Credit Scorecerer Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_cards table
CREATE TABLE IF NOT EXISTS public.credit_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    card_number TEXT NOT NULL, -- Masked card number
    credit_limit DECIMAL(12,2) NOT NULL,
    current_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    available_credit DECIMAL(12,2) GENERATED ALWAYS AS (credit_limit - current_balance) STORED,
    interest_rate DECIMAL(5,2) NOT NULL,
    minimum_payment DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    last_payment_date DATE,
    last_payment_amount DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    rewards_type TEXT CHECK (rewards_type IN ('cashback', 'points', 'miles')) NOT NULL,
    rewards_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_scores table
CREATE TABLE IF NOT EXISTS public.credit_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 300 AND score <= 850),
    range_min INTEGER NOT NULL DEFAULT 300,
    range_max INTEGER NOT NULL DEFAULT 850,
    category TEXT CHECK (category IN ('Excellent', 'Good', 'Fair', 'Poor', 'Very Poor')) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    provider TEXT NOT NULL DEFAULT 'Credit Scorecerer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.credit_cards(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    type TEXT CHECK (type IN ('payment', 'purchase', 'interest', 'fee')) NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spending_data table
CREATE TABLE IF NOT EXISTS public.spending_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    total_spent DECIMAL(12,2) NOT NULL DEFAULT 0,
    budget DECIMAL(12,2) NOT NULL DEFAULT 0,
    month_year DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spending_categories table
CREATE TABLE IF NOT EXISTS public.spending_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spending_data_id UUID REFERENCES public.spending_data(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    spent DECIMAL(12,2) NOT NULL DEFAULT 0,
    budget DECIMAL(12,2) NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT '#3B82F6'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON public.credit_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_user_id ON public.credit_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_card_id ON public.payment_history(card_id);
CREATE INDEX IF NOT EXISTS idx_spending_data_user_id ON public.spending_data(user_id);
CREATE INDEX IF NOT EXISTS idx_spending_categories_spending_data_id ON public.spending_categories(spending_data_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Credit cards policies
CREATE POLICY "Users can view own credit cards" ON public.credit_cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit cards" ON public.credit_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit cards" ON public.credit_cards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credit cards" ON public.credit_cards
    FOR DELETE USING (auth.uid() = user_id);

-- Credit scores policies
CREATE POLICY "Users can view own credit scores" ON public.credit_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit scores" ON public.credit_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit scores" ON public.credit_scores
    FOR UPDATE USING (auth.uid() = user_id);

-- Payment history policies
CREATE POLICY "Users can view own payment history" ON public.payment_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment history" ON public.payment_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment history" ON public.payment_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Spending data policies
CREATE POLICY "Users can view own spending data" ON public.spending_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spending data" ON public.spending_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spending data" ON public.spending_data
    FOR UPDATE USING (auth.uid() = user_id);

-- Spending categories policies
CREATE POLICY "Users can view own spending categories" ON public.spending_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.spending_data 
            WHERE id = spending_categories.spending_data_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own spending categories" ON public.spending_categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.spending_data 
            WHERE id = spending_categories.spending_data_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own spending categories" ON public.spending_categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.spending_data 
            WHERE id = spending_categories.spending_data_id 
            AND user_id = auth.uid()
        )
    );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON public.credit_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_scores_updated_at BEFORE UPDATE ON public.credit_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spending_data_updated_at BEFORE UPDATE ON public.spending_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for demo purposes (optional)
-- Uncomment the following lines if you want to insert sample data

/*
-- Sample credit cards for demo user
INSERT INTO public.credit_cards (
    user_id,
    name,
    issuer,
    card_number,
    credit_limit,
    current_balance,
    interest_rate,
    minimum_payment,
    due_date,
    rewards_type,
    rewards_rate
) VALUES 
(
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    'Chase Sapphire Preferred',
    'Chase',
    '**** **** **** 1234',
    15000.00,
    4500.00,
    24.99,
    135.00,
    '2024-03-15',
    'points',
    2.00
),
(
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    'Capital One Venture',
    'Capital One',
    '**** **** **** 5678',
    10000.00,
    2300.00,
    22.99,
    69.00,
    '2024-03-20',
    'miles',
    2.00
);

-- Sample credit score for demo user
INSERT INTO public.credit_scores (
    user_id,
    score,
    category,
    provider
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    720,
    'Good',
    'Credit Scorecerer'
);
*/
