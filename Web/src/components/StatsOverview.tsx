import React, { useState } from 'react';
import { SpendingData } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { CreditCard, TrendingUp, DollarSign, PieChart, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
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
            {/* Monthly Budget Progress - Left Half */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Monthly Budget</p>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(spendingData.totalSpent)} / {formatCurrency(spendingData.budget)}
                </p>
              </div>
              {(() => {
                const budgetProgress = (spendingData.totalSpent / spendingData.budget) * 100;
                const isOverBudget = budgetProgress > 100;
                const isNearBudget = budgetProgress > 80;
                
                let progressColor = 'bg-gradient-to-r from-green-500 to-green-400'; // Good
                if (isNearBudget && !isOverBudget) {
                  progressColor = 'bg-gradient-to-r from-yellow-500 to-yellow-400'; // Warning
                } else if (isOverBudget) {
                  progressColor = 'bg-gradient-to-r from-red-500 to-red-400'; // Danger
                }
                
                return (
                  <>
                    <div className={`w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full h-4 mb-2`}>
                      <div 
                        className={`${progressColor} h-4 rounded-full transition-all duration-500 shadow-lg`}
                        style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                        {budgetProgress.toFixed(1)}% of budget used
                      </p>
                      {isOverBudget && (
                        <p className="text-xs text-red-400 font-medium">
                          Over budget by {formatCurrency(spendingData.totalSpent - spendingData.budget)}
                        </p>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Spending by Category - Right Half */}
            <div>
              <div className="flex flex-col items-center mb-4">
                <button
                  onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                  className={`flex items-center space-x-2 transition-colors mb-2 ${
                    isDark 
                      ? 'hover:text-white text-white/70' 
                      : 'hover:text-gray-900 text-gray-600'
                  }`}
                >
                  <p className="text-sm font-medium">Spending by Category</p>
                  {isCategoriesExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(spendingData.categories.reduce((sum, cat) => sum + cat.spent, 0))} / {formatCurrency(spendingData.categories.reduce((sum, cat) => sum + cat.budget, 0))}
                </p>
              </div>
              
              {isCategoriesExpanded && (
                <div className="space-y-3 animate-fade-in">
                  {spendingData.categories.map((category, index) => {
                    const categoryProgress = (category.spent / category.budget) * 100;
                    const isOverCategoryBudget = categoryProgress > 100;
                    const isNearCategoryBudget = categoryProgress > 80;
                    
                    let categoryProgressColor = 'bg-gradient-to-r from-blue-500 to-blue-400';
                    if (isNearCategoryBudget && !isOverCategoryBudget) {
                      categoryProgressColor = 'bg-gradient-to-r from-yellow-500 to-yellow-400';
                    } else if (isOverCategoryBudget) {
                      categoryProgressColor = 'bg-gradient-to-r from-red-500 to-red-400';
                    }
                    
                    return (
                      <div key={index} className="glass rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2 shadow-lg" 
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {category.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatCurrency(category.spent)}
                            </span>
                            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                              of {formatCurrency(category.budget)}
                            </p>
                          </div>
                        </div>
                        <div className={`w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full h-2 mb-1`}>
                          <div 
                            className={`${categoryProgressColor} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(categoryProgress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                            {categoryProgress.toFixed(1)}% used
                          </p>
                          {isOverCategoryBudget && (
                            <p className="text-xs text-red-400 font-medium">
                              Over by {formatCurrency(category.spent - category.budget)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsOverview;
