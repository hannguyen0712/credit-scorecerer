import React, { useState, useEffect } from 'react';
import { CreditCard, CreditScore, SpendingData } from '../types';
import CreditService from '../services/CreditService';
import CreditCardItem from './CreditCardItem';
import StatsOverview from './StatsOverview';
import PurchaseConsultation from './PurchaseConsultation';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { CreditCard as CreditCardIcon, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [cards, score, spending] = await Promise.all([
        CreditService.getCreditCards(),
        CreditService.getCreditScore(),
        CreditService.getSpendingData(),
      ]);
      
      setCreditCards(cards);
      setCreditScore(score);
      setSpendingData(spending);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (cardId: string, amount: number) => {
    try {
      await CreditService.makePayment(cardId, amount);
      await loadDashboardData(); // Refresh data
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary border-r-secondary mx-auto"></div>
          <p className="mt-6 text-white/70 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="glass rounded-2xl p-8 max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6 animate-pulse" />
            <p className="text-red-300 mb-6 text-lg">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalCreditLimit = creditCards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalBalance = creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
  const totalAvailableCredit = totalCreditLimit - totalBalance;
  const overallUtilization = (totalBalance / totalCreditLimit) * 100;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Credit Dashboard</h1>
              <p className={`text-lg mt-2 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Manage your credit cards and optimize your spending</p>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              {creditScore && (
                <div className="glass rounded-2xl p-6 text-right">
                  <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Credit Score</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{creditScore.score}</p>
                  <p className="text-sm text-primary font-semibold">{creditScore.category}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview 
            totalCreditLimit={totalCreditLimit}
            totalBalance={totalBalance}
            totalAvailableCredit={totalAvailableCredit}
            overallUtilization={overallUtilization}
            spendingData={spendingData}
          />
        </div>

        {/* AI Consultation */}
        <div className="mb-8">
          <PurchaseConsultation creditCards={creditCards} />
        </div>

        {/* Credit Cards Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <CreditCardIcon className="h-8 w-8 mr-3 text-primary" />
              Your Credit Cards
            </h2>
            <span className="glass px-4 py-2 rounded-full text-white/70 text-sm font-medium">
              {creditCards.length} card{creditCards.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {creditCards.map((card) => (
              <CreditCardItem
                key={card.id}
                card={card}
                onPayment={handlePayment}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-8">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="glass card-hover rounded-xl p-6 text-left group">
              <TrendingUp className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-white text-lg mb-2">View Credit Report</p>
              <p className="text-white/60">Check your credit history</p>
            </button>
            <button className="glass card-hover rounded-xl p-6 text-left group">
              <DollarSign className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-white text-lg mb-2">Make Payment</p>
              <p className="text-white/60">Pay down your balances</p>
            </button>
            <button className="glass card-hover rounded-xl p-6 text-left group">
              <AlertCircle className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-white text-lg mb-2">Get Alerts</p>
              <p className="text-white/60">Set up payment reminders</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
