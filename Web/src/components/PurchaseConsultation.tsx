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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">AI Purchase Consultation</h3>
              <p className="text-sm text-gray-500">Get intelligent recommendations before making purchases</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
          >
            {isOpen ? 'Close' : 'Get Advice'}
          </button>
        </div>
      </div>

      {/* Consultation Form */}
      {isOpen && (
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Purchase Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Amount *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.purchaseAmount || ''}
                    onChange={(e) => setFormData({ ...formData, purchaseAmount: parseFloat(e.target.value) || 0 })}
                    className="flex-1 rounded-r-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Purchase Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.purchaseCategory}
                  onChange={(e) => setFormData({ ...formData, purchaseCategory: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Describe what you're planning to purchase..."
                required
              />
            </div>

            {/* Preferred Card (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Card (Optional)
              </label>
              <select
                value={formData.preferredCard}
                onChange={(e) => setFormData({ ...formData, preferredCard: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get AI Recommendation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          {consultation && (
            <div className="mt-6 space-y-4">
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendation</h4>
                
                {/* Main Recommendation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${getImpactColor(consultation.recommendation.creditImpact)}`}>
                      {getImpactIcon(consultation.recommendation.creditImpact)}
                    </div>
                    <div className="ml-3 flex-1">
                      <h5 className="font-medium text-gray-900 mb-1">
                        Recommended: {consultation.recommendation.recommendedCard}
                      </h5>
                      <p className="text-sm text-gray-700 mb-2">
                        {consultation.recommendation.reasoning}
                      </p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(consultation.recommendation.creditImpact)}`}>
                          {consultation.recommendation.creditImpact} credit impact
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {consultation.recommendation.impactExplanation}
                  </p>
                </div>

                {/* Alternative Options */}
                {consultation.alternatives.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-3">Alternative Options</h5>
                    <div className="space-y-3">
                      {consultation.alternatives.map((alt, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <h6 className="font-medium text-gray-900 mb-2">{alt.cardName}</h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {alt.pros.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-green-700 mb-1">Pros:</p>
                                <ul className="text-xs text-green-600 space-y-1">
                                  {alt.pros.map((pro, i) => (
                                    <li key={i}>• {pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {alt.cons.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-red-700 mb-1">Cons:</p>
                                <ul className="text-xs text-red-600 space-y-1">
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
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      Tips & Recommendations
                    </h5>
                    <ul className="space-y-2">
                      {consultation.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm text-gray-700">{tip}</span>
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
