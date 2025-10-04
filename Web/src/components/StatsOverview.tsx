import React from 'react';
import { SpendingData } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface StatsOverviewProps {
  totalCreditLimit: number;
  totalBalance: number;
  totalAvailableCredit: number;
  overallUtilization: number;
  spendingData: SpendingData | null;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalCreditLimit,
  totalBalance,
  totalAvailableCredit,
  overallUtilization,
  spendingData,
}) => {
  const { isDark } = useTheme();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 30) return 'text-red-600';
    if (utilization > 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization > 30) return 'bg-red-100';
    if (utilization > 10) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Credit Limit */}
      <div className="glass card-hover rounded-2xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-primary/20 rounded-xl">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Total Credit Limit</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalCreditLimit)}</p>
          </div>
        </div>
      </div>

      {/* Current Balance */}
      <div className="glass card-hover rounded-2xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <DollarSign className="h-8 w-8 text-red-400" />
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Current Balance</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </div>

      {/* Available Credit */}
      <div className="glass card-hover rounded-2xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Available Credit</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalAvailableCredit)}</p>
          </div>
        </div>
      </div>

      {/* Credit Utilization */}
      <div className="glass card-hover rounded-2xl p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${getUtilizationBgColor(overallUtilization)}`}>
            <PieChart className={`h-8 w-8 ${getUtilizationColor(overallUtilization)}`} />
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Credit Utilization</p>
            <p className={`text-2xl font-bold ${getUtilizationColor(overallUtilization)}`}>
              {overallUtilization.toFixed(1)}%
            </p>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              {overallUtilization > 30 ? 'High utilization' : 
               overallUtilization > 10 ? 'Good utilization' : 'Excellent utilization'}
            </p>
          </div>
        </div>
      </div>

      {/* Spending Overview */}
      {spendingData && (
        <div className="md:col-span-2 lg:col-span-4 glass rounded-2xl p-8">
          <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Spending Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Spending */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>This Month</p>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  {formatCurrency(spendingData.totalSpent)} / {formatCurrency(spendingData.budget)}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(spendingData.totalSpent / spendingData.budget) * 100}%` }}
                ></div>
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                {((spendingData.totalSpent / spendingData.budget) * 100).toFixed(1)}% of budget used
              </p>
            </div>

            {/* Spending by Category */}
            <div>
              <p className={`text-sm font-medium mb-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Spending by Category</p>
              <div className="space-y-3">
                {spendingData.categories.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between glass rounded-xl p-3">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3 shadow-lg" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(category.spent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsOverview;
