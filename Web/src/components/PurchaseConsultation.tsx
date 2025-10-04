import React, { useState } from 'react';
import { CreditCard, AIConsultationRequest, AIConsultationResponse } from '../types';
import GeminiService from '../services/GeminiService';
import { Bot, Send, Loader, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface PurchaseConsultationProps {
  creditCards: CreditCard[];
}

const PurchaseConsultation: React.FC<PurchaseConsultationProps> = ({ creditCards }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [consultation, setConsultation] = useState<AIConsultationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AIConsultationRequest>({
    purchaseAmount: 0,
    purchaseCategory: '',
    description: '',
    preferredCard: '',
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Gas',
    'Groceries',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purchaseAmount || !formData.purchaseCategory || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setConsultation(null);

    try {
      const response = await GeminiService.getPurchaseRecommendation(formData, creditCards);
      setConsultation(response);
    } catch (err) {
      setError('Failed to get AI recommendation. Please try again.');
      console.error('Consultation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      purchaseAmount: 0,
      purchaseCategory: '',
      description: '',
      preferredCard: '',
    });
    setConsultation(null);
    setError(null);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="h-4 w-4" />;
      case 'negative': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/10">
      {/* Header */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
              <Bot className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-white">AI Purchase Consultation</h3>
              <p className="text-white/70">Get intelligent recommendations before making purchases</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-primary px-6 py-3 text-white rounded-xl text-sm font-semibold hover:scale-105 transition-transform"
          >
            {isOpen ? 'Close' : 'Get Advice'}
          </button>
        </div>
      </div>

      {/* Consultation Form */}
      {isOpen && (
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Amount */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Purchase Amount *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/20 bg-white/10 text-white/70 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.purchaseAmount || ''}
                    onChange={(e) => setFormData({ ...formData, purchaseAmount: parseFloat(e.target.value) || 0 })}
                    className="flex-1 rounded-r-xl border-white/20 bg-white/10 text-white placeholder-white/50 shadow-sm focus:ring-primary focus:border-primary"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Purchase Category */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Category *
                </label>
                <select
                  value={formData.purchaseCategory}
                  onChange={(e) => setFormData({ ...formData, purchaseCategory: e.target.value })}
                  className="w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border-white/20 bg-white/10 text-white placeholder-white/50 shadow-sm focus:ring-primary focus:border-primary"
                rows={3}
                placeholder="Describe what you're planning to purchase..."
                required
              />
            </div>

            {/* Preferred Card (Optional) */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Preferred Card (Optional)
              </label>
              <select
                value={formData.preferredCard}
                onChange={(e) => setFormData({ ...formData, preferredCard: e.target.value })}
                className="w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Let AI choose the best card</option>
                {creditCards.map((card) => (
                  <option key={card.id} value={card.name}>
                    {card.name} - {card.issuer}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Get AI Recommendation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-white/20 text-white/70 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          {consultation && (
            <div className="mt-8 space-y-6">
              <div className="border-t border-white/10 pt-8">
                <h4 className="text-2xl font-bold text-white mb-6">AI Recommendation</h4>
                
                {/* Main Recommendation */}
                <div className="glass rounded-2xl p-6 mb-6">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-xl ${getImpactColor(consultation.recommendation.creditImpact)}`}>
                      {getImpactIcon(consultation.recommendation.creditImpact)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h5 className="font-bold text-white text-lg mb-2">
                        Recommended: {consultation.recommendation.recommendedCard}
                      </h5>
                      <p className="text-white/80 mb-3">
                        {consultation.recommendation.reasoning}
                      </p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getImpactColor(consultation.recommendation.creditImpact)}`}>
                          {consultation.recommendation.creditImpact} credit impact
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 mt-3">
                    {consultation.recommendation.impactExplanation}
                  </p>
                </div>

                {/* Alternative Options */}
                {consultation.alternatives.length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-bold text-white text-lg mb-4">Alternative Options</h5>
                    <div className="space-y-4">
                      {consultation.alternatives.map((alt, index) => (
                        <div key={index} className="glass rounded-xl p-4">
                          <h6 className="font-bold text-white mb-3">{alt.cardName}</h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alt.pros.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-green-400 mb-2">Pros:</p>
                                <ul className="text-sm text-green-300 space-y-1">
                                  {alt.pros.map((pro, i) => (
                                    <li key={i}>• {pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {alt.cons.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-red-400 mb-2">Cons:</p>
                                <ul className="text-sm text-red-300 space-y-1">
                                  {alt.cons.map((con, i) => (
                                    <li key={i}>• {con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {consultation.tips.length > 0 && (
                  <div>
                    <h5 className="font-bold text-white text-lg mb-4 flex items-center">
                      <Lightbulb className="h-6 w-6 mr-3 text-yellow-400" />
                      Tips & Recommendations
                    </h5>
                    <ul className="space-y-3">
                      {consultation.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-3 h-3 bg-yellow-400 rounded-full mt-2 mr-4"></span>
                          <span className="text-white/80">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseConsultation;
