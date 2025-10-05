/*
-- Sample credit cards (uncomment after having users)
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
    last_payment_date,
    last_payment_amount,
    is_active,
    rewards_type,
    rewards_rate
) VALUES 
-- User 1 cards
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0), -- First user
    'Chase Sapphire Preferred',
    'Chase',
    '**** **** **** 1234',
    15000.00,
    4500.00,
    24.99,
    135.00,
    '2024-03-15',
    '2024-02-15',
    500.00,
    true,
    'points',
    2.00
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0), -- First user
    'Capital One Venture',
    'Capital One',
    '**** **** **** 5678',
    10000.00,
    2300.00,
    22.99,
    69.00,
    '2024-03-20',
    '2024-02-20',
    300.00,
    true,
    'miles',
    2.00
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0), -- First user
    'American Express Gold',
    'American Express',
    '**** **** **** 9012',
    25000.00,
    8500.00,
    25.99,
    212.50,
    '2024-03-25',
    '2024-02-25',
    750.00,
    true,
    'points',
    4.00
),

-- User 2 cards (if you have a second user)
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 1), -- Second user
    'Citi Double Cash',
    'Citi',
    '**** **** **** 3456',
    8000.00,
    1200.00,
    23.99,
    36.00,
    '2024-03-10',
    '2024-02-10',
    200.00,
    true,
    'cashback',
    2.00
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 1), -- Second user
    'Discover it Cash Back',
    'Discover',
    '**** **** **** 7890',
    12000.00,
    3200.00,
    22.99,
    96.00,
    '2024-03-18',
    '2024-02-18',
    400.00,
    true,
    'cashback',
    5.00
);

-- Sample credit scores
INSERT INTO public.credit_scores (
    user_id,
    score,
    category,
    provider
) VALUES 
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0), -- First user
    720,
    'Good',
    'Credit Scorecerer'
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 1), -- Second user
    780,
    'Good',
    'Credit Scorecerer'
);

-- Sample payment history
INSERT INTO public.payment_history (
    user_id,
    card_id,
    amount,
    date,
    type,
    description,
    category
) VALUES 
-- Payments
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.credit_cards WHERE name = 'Chase Sapphire Preferred' LIMIT 1),
    500.00,
    '2024-02-15',
    'payment',
    'Monthly payment',
    'Payment'
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.credit_cards WHERE name = 'Capital One Venture' LIMIT 1),
    300.00,
    '2024-02-20',
    'payment',
    'Monthly payment',
    'Payment'
),

-- Purchases
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.credit_cards WHERE name = 'Chase Sapphire Preferred' LIMIT 1),
    150.00,
    '2024-02-10',
    'purchase',
    'Grocery shopping at Whole Foods',
    'Groceries'
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.credit_cards WHERE name = 'Capital One Venture' LIMIT 1),
    89.99,
    '2024-02-12',
    'purchase',
    'Gas station fill-up',
    'Transportation'
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.credit_cards WHERE name = 'American Express Gold' LIMIT 1),
    250.00,
    '2024-02-14',
    'purchase',
    'Restaurant dinner',
    'Dining'
),

-- Interest charges
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    (SELECT id FROM public.credit_cards WHERE name = 'Chase Sapphire Preferred' LIMIT 1),
    93.75,
    '2024-02-01',
    'interest',
    'Monthly interest charge',
    'Interest'
);

-- Sample spending data
INSERT INTO public.spending_data (
    user_id,
    total_spent,
    budget,
    month_year
) VALUES 
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 0),
    489.99,
    2000.00,
    '2024-02-01'
),
(
    (SELECT id FROM auth.users LIMIT 1 OFFSET 1),
    320.00,
    1500.00,
    '2024-02-01'
);

-- Sample spending categories
INSERT INTO public.spending_categories (
    spending_data_id,
    name,
    spent,
    budget,
    color
) VALUES 
-- User 1 categories
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 0),
    'Groceries',
    150.00,
    400.00,
    '#10B981'
),
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 0),
    'Transportation',
    89.99,
    300.00,
    '#3B82F6'
),
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 0),
    'Dining',
    250.00,
    500.00,
    '#F59E0B'
),
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 0),
    'Entertainment',
    0.00,
    200.00,
    '#8B5CF6'
),

-- User 2 categories
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 1),
    'Groceries',
    120.00,
    350.00,
    '#10B981'
),
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 1),
    'Transportation',
    80.00,
    250.00,
    '#3B82F6'
),
(
    (SELECT id FROM public.spending_data LIMIT 1 OFFSET 1),
    'Dining',
    120.00,
    400.00,
    '#F59E0B'
);
*/

-- Alternative: Create a function to populate sample data for the current user
-- This function can be called after a user signs up

CREATE OR REPLACE FUNCTION populate_sample_data_for_user(user_email TEXT)
RETURNS void AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user ID from email
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Insert sample credit cards
    INSERT INTO public.credit_cards (
        user_id, name, issuer, card_number, credit_limit, current_balance,
        interest_rate, minimum_payment, due_date, last_payment_date, last_payment_amount,
        is_active, rewards_type, rewards_rate
    ) VALUES 
    (
        user_uuid, 'Chase Sapphire Preferred', 'Chase', '**** **** **** 1234',
        15000.00, 4500.00, 24.99, 135.00, '2024-03-15', '2024-02-15', 500.00,
        true, 'points', 2.00
    ),
    (
        user_uuid, 'Capital One Venture', 'Capital One', '**** **** **** 5678',
        10000.00, 2300.00, 22.99, 69.00, '2024-03-20', '2024-02-20', 300.00,
        true, 'miles', 2.00
    ),
    (
        user_uuid, 'American Express Gold', 'American Express', '**** **** **** 9012',
        25000.00, 8500.00, 25.99, 212.50, '2024-03-25', '2024-02-25', 750.00,
        true, 'points', 4.00
    );
    
    -- Insert sample credit score
    INSERT INTO public.credit_scores (user_id, score, category, provider)
    VALUES (user_uuid, 720, 'Good', 'Credit Scorecerer');
    
    -- Insert sample payment history
    INSERT INTO public.payment_history (
        user_id, card_id, amount, date, type, description, category
    ) VALUES 
    (
        user_uuid, 
        (SELECT id FROM public.credit_cards WHERE user_id = user_uuid AND name = 'Chase Sapphire Preferred' LIMIT 1),
        500.00, '2024-02-15', 'payment', 'Monthly payment', 'Payment'
    ),
    (
        user_uuid,
        (SELECT id FROM public.credit_cards WHERE user_id = user_uuid AND name = 'Capital One Venture' LIMIT 1),
        300.00, '2024-02-20', 'payment', 'Monthly payment', 'Payment'
    ),
    (
        user_uuid,
        (SELECT id FROM public.credit_cards WHERE user_id = user_uuid AND name = 'Chase Sapphire Preferred' LIMIT 1),
        150.00, '2024-02-10', 'purchase', 'Grocery shopping at Whole Foods', 'Groceries'
    ),
    (
        user_uuid,
        (SELECT id FROM public.credit_cards WHERE user_id = user_uuid AND name = 'Capital One Venture' LIMIT 1),
        89.99, '2024-02-12', 'purchase', 'Gas station fill-up', 'Transportation'
    ),
    (
        user_uuid,
        (SELECT id FROM public.credit_cards WHERE user_id = user_uuid AND name = 'American Express Gold' LIMIT 1),
        250.00, '2024-02-14', 'purchase', 'Restaurant dinner', 'Dining'
    );
    
    -- Insert sample spending data
    INSERT INTO public.spending_data (user_id, total_spent, budget, month_year)
    VALUES (user_uuid, 489.99, 2000.00, '2024-02-01');
    
    -- Insert sample spending categories
    INSERT INTO public.spending_categories (spending_data_id, name, spent, budget, color)
    VALUES 
    (
        (SELECT id FROM public.spending_data WHERE user_id = user_uuid LIMIT 1),
        'Groceries', 150.00, 400.00, '#10B981'
    ),
    (
        (SELECT id FROM public.spending_data WHERE user_id = user_uuid LIMIT 1),
        'Transportation', 89.99, 300.00, '#3B82F6'
    ),
    (
        (SELECT id FROM public.spending_data WHERE user_id = user_uuid LIMIT 1),
        'Dining', 250.00, 500.00, '#F59E0B'
    ),
    (
        (SELECT id FROM public.spending_data WHERE user_id = user_uuid LIMIT 1),
        'Entertainment', 0.00, 200.00, '#8B5CF6'
    );
    
    RAISE NOTICE 'Sample data populated for user: %', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION populate_sample_data_for_user(TEXT) TO authenticated;
