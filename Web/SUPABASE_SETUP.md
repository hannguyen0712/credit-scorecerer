# Supabase Setup Guide

This guide will help you set up Supabase for the Credit Scorecerer application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - Name: `credit-scorecerer`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"
5. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql` from this project
4. Click "Run" to execute the schema

This will create:
- User profiles table
- Credit cards table
- Credit scores table
- Payment history table
- Spending data tables
- Row Level Security (RLS) policies
- Automatic triggers and functions

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000` for development
3. Under **Auth Providers**, ensure **Email** is enabled
4. Optionally configure other providers (Google, GitHub, etc.)

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`

3. Try creating a new account:
   - Click "Sign up here"
   - Fill in the form
   - Submit the form

4. Check your Supabase dashboard:
   - Go to **Authentication** → **Users** to see the new user
   - Go to **Table Editor** → **users** to see the user profile

## Step 7: Production Deployment

When deploying to production:

1. Update your Supabase project settings:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add your production domain

2. Update your environment variables in your hosting platform:
   - Set `REACT_APP_SUPABASE_URL` to your Supabase project URL
   - Set `REACT_APP_SUPABASE_ANON_KEY` to your Supabase anon key

## Troubleshooting

### Common Issues

1. **"Supabase not configured" warning**
   - Check that your environment variables are set correctly
   - Restart your development server after updating `.env`

2. **Authentication errors**
   - Verify your Supabase URL and anon key are correct
   - Check that email authentication is enabled in Supabase

3. **Database connection errors**
   - Ensure you've run the SQL schema in the Supabase SQL Editor
   - Check that RLS policies are properly configured

4. **CORS errors**
   - Add your domain to the allowed origins in Supabase settings
   - For development, `http://localhost:3000` should be added

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

## Security Notes

- Never commit your `.env` file to version control
- The `anon` key is safe to use in client-side code
- Row Level Security (RLS) ensures users can only access their own data
- Always use HTTPS in production

## Next Steps

Once Supabase is configured:

1. Users can sign up and log in
2. User data is stored securely in the cloud
3. The app will work offline with mock data if Supabase is unavailable
4. You can add more features like real-time updates, file storage, etc.

The application includes a fallback to mock authentication if Supabase is not configured, so you can continue development even without setting up Supabase immediately.
