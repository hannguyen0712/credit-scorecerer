# 🚀 Quick Start Guide

Get your CreditScorecerer web app running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Google account for Gemini API key

## Step 1: Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Setup the App

```bash
# Navigate to the web app directory
cd credit-scorecerer/Web

# Run the automated setup
./setup.sh
```

## Step 3: Configure API Key

Edit the `.env` file and replace `your_gemini_api_key_here` with your actual API key:

```bash
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

## Step 4: Start the App

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🎉 You're Ready!

Your CreditScorecerer web app is now running with:

- ✅ Credit card dashboard
- ✅ AI purchase consultation
- ✅ Payment management
- ✅ Credit utilization tracking

## 🔧 Troubleshooting

**App won't start?**
- Make sure Node.js 16+ is installed
- Run `npm install` to install dependencies

**AI consultation not working?**
- Check your API key in the `.env` file
- Verify the key is valid at Google AI Studio

**Build errors?**
- Delete `node_modules` and run `npm install` again
- Check the browser console for specific errors

## 📱 Features to Try

1. **View Credit Cards**: See your cards with balances and utilization
2. **Make Payments**: Click "Make Payment" on any card
3. **AI Consultation**: Click "Get Advice" to consult AI before purchases
4. **Responsive Design**: Try on mobile by resizing your browser

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the troubleshooting section
- Ensure all environment variables are set correctly

Happy credit managing! 💳✨

