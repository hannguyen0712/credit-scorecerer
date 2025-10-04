import React, { useState } from 'react';
import { CreditCard } from '../types';
import { CreditCard as CreditCardIcon, DollarSign, Calendar, TrendingUp, MoreVertical } from 'lucide-react';

interface CreditCardItemProps {
  card: CreditCard;
  onPayment: (cardId: string, amount: number) => void;
}

const CreditCardItem: React.FC<CreditCardItemProps> = ({ card, onPayment }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const utilization = (card.currentBalance / card.creditLimit) * 100;
  const getUtilizationColor = (util: number) => {
    if (util > 30) return 'text-red-600';
    if (util > 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUtilizationBgColor = (util: number) => {
    if (util > 30) return 'bg-red-100';
    if (util > 10) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0 && amount <= card.currentBalance) {
      setIsProcessing(true);
      try {
        await onPayment(card.id, amount);
        setPaymentAmount('');
        setShowPaymentForm(false);
      } catch (error) {
        console.error('Payment failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const getRewardsText = () => {
    const { type, rate } = card.rewards;
    switch (type) {
      case 'cashback':
        return `${rate}% cashback`;
      case 'points':
        return `${rate}x points`;
      case 'miles':
        return `${rate}x miles`;
      default:
        return 'Rewards program';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CreditCardIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{card.name}</h3>
              <p className="text-sm text-gray-500">{card.issuer} • {card.cardNumber}</p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6">
        {/* Balance and Credit Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(card.currentBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Credit</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(card.availableCredit)}</p>
          </div>
        </div>

        {/* Credit Limit and Utilization */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Credit Limit</span>
            <span className="text-sm font-medium text-gray-900">{formatCurrency(card.creditLimit)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getUtilizationBgColor(utilization)}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs font-medium ${getUtilizationColor(utilization)}`}>
              {utilization.toFixed(1)}% utilized
            </span>
            <span className="text-xs text-gray-500">
              {utilization > 30 ? 'High utilization' : 
               utilization > 10 ? 'Good utilization' : 'Excellent utilization'}
            </span>
          </div>
        </div>

        {/* Rewards and Interest Rate */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Rewards</p>
            <p className="text-sm font-medium text-gray-900">{getRewardsText()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Interest Rate</p>
            <p className="text-sm font-medium text-gray-900">{card.interestRate}% APR</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-xs text-gray-600">Due Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(card.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600">Min Payment</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(card.minimumPayment)}</p>
          </div>
        </div>

        {/* Payment Form */}
        {showPaymentForm ? (
          <div className="border-t pt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="flex-1 rounded-r-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  max={card.currentBalance}
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePayment}
                disabled={isProcessing || !paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Make Payment'}
              </button>
              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setPaymentAmount('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 flex items-center justify-center"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Make Payment
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditCardItem;
