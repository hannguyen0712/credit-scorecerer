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
    <div className="glass card-hover rounded-2xl border border-white/10">
      {/* Card Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-primary/20 rounded-xl">
              <CreditCardIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-white text-lg">{card.name}</h3>
              <p className="text-sm text-white/60">{card.issuer} • {card.cardNumber}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <MoreVertical className="h-5 w-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6">
        {/* Balance and Credit Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-white/70 mb-1">Current Balance</p>
            <p className="text-xl font-bold text-white">{formatCurrency(card.currentBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-1">Available Credit</p>
            <p className="text-xl font-bold text-green-400">{formatCurrency(card.availableCredit)}</p>
          </div>
        </div>

        {/* Credit Limit and Utilization */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white/70">Credit Limit</span>
            <span className="text-sm font-medium text-white">{formatCurrency(card.creditLimit)}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getUtilizationBgColor(utilization)}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm font-bold ${getUtilizationColor(utilization)}`}>
              {utilization.toFixed(1)}% utilized
            </span>
            <span className="text-xs text-white/50">
              {utilization > 30 ? 'High utilization' : 
               utilization > 10 ? 'Good utilization' : 'Excellent utilization'}
            </span>
          </div>
        </div>

        {/* Rewards and Interest Rate */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-white/70 mb-1">Rewards</p>
            <p className="text-sm font-bold text-white">{getRewardsText()}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-1">Interest Rate</p>
            <p className="text-sm font-bold text-white">{card.interestRate}% APR</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-white/60 mr-3" />
            <div>
              <p className="text-xs text-white/60">Due Date</p>
              <p className="text-sm font-bold text-white">
                {new Date(card.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Min Payment</p>
            <p className="text-sm font-bold text-white">{formatCurrency(card.minimumPayment)}</p>
          </div>
        </div>

        {/* Payment Form */}
        {showPaymentForm ? (
          <div className="border-t border-white/10 pt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Payment Amount
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/20 bg-white/10 text-white/70 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="flex-1 rounded-r-xl border-white/20 bg-white/10 text-white placeholder-white/50 shadow-sm focus:ring-primary focus:border-primary"
                  placeholder="0.00"
                  max={card.currentBalance}
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePayment}
                disabled={isProcessing || !paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1 btn-primary text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? 'Processing...' : 'Make Payment'}
              </button>
              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setPaymentAmount('');
                }}
                className="px-6 py-3 border border-white/20 text-white/70 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex-1 btn-primary text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Make Payment
            </button>
            <button className="px-6 py-3 border border-white/20 text-white/70 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditCardItem;
