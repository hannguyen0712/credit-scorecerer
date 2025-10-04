# CreditScorecerer Web App

A modern web application for credit card management with AI-powered purchase consultation using Google Gemini API.

## 🚀 Features

- **📊 Credit Card Dashboard**: View all your credit cards with balances, usage, and rewards
- **🤖 AI Purchase Consultation**: Get intelligent recommendations before making purchases
- **📈 Real-time Analysis**: AI analyzes your credit profile and spending patterns
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **💳 Payment Management**: Make payments directly from the dashboard
- **📊 Credit Utilization Tracking**: Monitor and optimize your credit usage

## 🛠️ Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google Gemini API key

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp env.example .env
   ```

3. **Get Google Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key and add it to your `.env` file

4. **Start the Development Server**
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/                    # React components
│   ├── Dashboard.tsx            # Main dashboard component
│   ├── CreditCardItem.tsx       # Individual credit card display
│   ├── StatsOverview.tsx        # Dashboard statistics
│   └── PurchaseConsultation.tsx # AI consultation feature
├── services/                     # API services
│   ├── GeminiService.ts         # Google Gemini integration
│   └── CreditService.ts         # Credit card data management
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type definitions
├── App.tsx                      # Main app component
├── index.tsx                    # App entry point
└── index.css                    # Global styles
```

## 🎯 Features Overview

### Dashboard
- **Credit Card Overview**: View all your credit cards with key metrics
- **Usage Tracking**: Monitor credit utilization across all cards
- **Rewards Summary**: Track points, miles, and cashback rewards
- **Quick Actions**: Easy access to common tasks
- **Payment Management**: Make payments directly from cards

### AI Purchase Consultation
- **Smart Recommendations**: Get AI-powered advice on purchases
- **Credit Optimization**: Choose the best card for each purchase
- **Risk Assessment**: Understand potential impacts on your credit
- **Rewards Maximization**: Optimize your rewards earning
- **Alternative Analysis**: Compare different card options

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API
- **Build Tool**: Create React App
- **State Management**: React Hooks

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Adding New Features

1. Create new components in `src/components/`
2. Add types to `src/types/index.ts`
3. Update services in `src/services/`
4. Follow the existing code structure and patterns

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GEMINI_API_KEY` | Google Gemini API key | Yes |
| `REACT_APP_API_BASE_URL` | Backend API URL (future use) | No |

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your Gemini API key is correctly set in the `.env` file
2. **Build Errors**: Ensure all dependencies are installed with `npm install`
3. **CORS Issues**: The app is configured to work with Google Gemini API directly
4. **Module Not Found**: Run `npm install` to ensure all dependencies are installed

### Getting Help

- Check the browser console for error messages
- Verify your API key is valid and has proper permissions
- Ensure all environment variables are set correctly
- Check the Network tab for API request failures

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## 🔮 Future Enhancements

- **Backend API Integration**: Real credit card data from financial institutions
- **User Authentication**: Secure user accounts and profiles
- **Historical Analysis**: Track spending patterns over time
- **Credit Score Monitoring**: Real-time credit score updates
- **Payment Reminders**: Automated alerts and notifications
- **Advanced AI Features**: More sophisticated financial advice
- **Mobile App**: React Native version for mobile devices
- **Data Export**: Export financial data and reports

## 📊 Sample Data

The app currently uses mock data for demonstration purposes. In a production environment, this would be replaced with real API calls to financial institutions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Ensure your API key is valid
4. Verify all dependencies are installed

For additional help, please open an issue in the repository.
