import React from 'react';
import { SpendingData } from '../types';
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Credit Limit</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCreditLimit)}</p>
          </div>
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </div>

      {/* Available Credit */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Available Credit</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAvailableCredit)}</p>
          </div>
        </div>
      </div>

      {/* Credit Utilization */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${getUtilizationBgColor(overallUtilization)}`}>
            <PieChart className={`h-6 w-6 ${getUtilizationColor(overallUtilization)}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Credit Utilization</p>
            <p className={`text-2xl font-bold ${getUtilizationColor(overallUtilization)}`}>
              {overallUtilization.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              {overallUtilization > 30 ? 'High utilization' : 
               overallUtilization > 10 ? 'Good utilization' : 'Excellent utilization'}
            </p>
          </div>
        </div>
      </div>

      {/* Spending Overview */}
      {spendingData && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Spending */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(spendingData.totalSpent)} / {formatCurrency(spendingData.budget)}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${(spendingData.totalSpent / spendingData.budget) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((spendingData.totalSpent / spendingData.budget) * 100).toFixed(1)}% of budget used
              </p>
            </div>

            {/* Spending by Category */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Spending by Category</p>
              <div className="space-y-2">
                {spendingData.categories.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
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
