import React, { useState, useEffect } from 'react';
import { CreditCard, CreditScore, SpendingData } from '../types';
import CreditService from '../services/CreditService';
import CreditCardItem from './CreditCardItem';
import StatsOverview from './StatsOverview';
import PurchaseConsultation from './PurchaseConsultation';
import { CreditCard as CreditCardIcon, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalCreditLimit = creditCards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalBalance = creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
  const totalAvailableCredit = totalCreditLimit - totalBalance;
  const overallUtilization = (totalBalance / totalCreditLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Credit Dashboard</h1>
              <p className="text-gray-600">Manage your credit cards and optimize your spending</p>
            </div>
            <div className="flex items-center space-x-4">
              {creditScore && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Credit Score</p>
                  <p className="text-2xl font-bold text-primary-600">{creditScore.score}</p>
                  <p className="text-sm text-gray-500">{creditScore.category}</p>
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCardIcon className="h-6 w-6 mr-2" />
              Your Credit Cards
            </h2>
            <span className="text-sm text-gray-500">
              {creditCards.length} card{creditCards.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Credit Report</p>
                <p className="text-sm text-gray-500">Check your credit history</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DollarSign className="h-5 w-5 text-primary-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Make Payment</p>
                <p className="text-sm text-gray-500">Pay down your balances</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AlertCircle className="h-5 w-5 text-primary-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Get Alerts</p>
                <p className="text-sm text-gray-500">Set up payment reminders</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
