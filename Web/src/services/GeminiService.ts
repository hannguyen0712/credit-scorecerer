import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreditCard, AIConsultationRequest, AIConsultationResponse } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('REACT_APP_GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async getPurchaseRecommendation(
    request: AIConsultationRequest,
    userCards: CreditCard[]
  ): Promise<AIConsultationResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = this.buildConsultationPrompt(request, userCards);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text, userCards);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      throw new Error('Failed to get AI recommendation. Please try again.');
    }
  }

  private buildConsultationPrompt(request: AIConsultationRequest, userCards: CreditCard[]): string {
    const cardsInfo = userCards.map(card => 
      `Card: ${card.name} (${card.issuer})
       - Credit Limit: $${card.creditLimit.toLocaleString()}
       - Current Balance: $${card.currentBalance.toLocaleString()}
       - Available Credit: $${card.availableCredit.toLocaleString()}
       - Interest Rate: ${card.interestRate}%
       - Rewards: ${card.rewards.type} at ${card.rewards.rate}% rate
       - Utilization: ${((card.currentBalance / card.creditLimit) * 100).toFixed(1)}%`
    ).join('\n\n');

    return `You are a financial advisor helping with credit card purchase decisions. 

User's Credit Cards:
${cardsInfo}

Purchase Details:
- Amount: $${request.purchaseAmount}
- Category: ${request.purchaseCategory}
- Description: ${request.description}
${request.preferredCard ? `- Preferred Card: ${request.preferredCard}` : ''}

Please provide a recommendation in the following JSON format:
{
  "recommendation": {
    "recommendedCard": "Card name",
    "reasoning": "Detailed explanation of why this card is best",
    "creditImpact": "positive|neutral|negative",
    "impactExplanation": "How this purchase affects credit score"
  },
  "alternatives": [
    {
      "cardId": "card-id",
      "cardName": "Card name",
      "pros": ["advantage 1", "advantage 2"],
      "cons": ["disadvantage 1", "disadvantage 2"]
    }
  ],
  "tips": [
    "Tip 1 for optimizing this purchase",
    "Tip 2 for credit management"
  ]
}

Consider:
1. Credit utilization impact
2. Rewards optimization
3. Interest rates if balance will be carried
4. Credit score implications
5. Payment due dates and cash flow

Provide practical, actionable advice.`;
  }

  private parseAIResponse(responseText: string, userCards: CreditCard[]): AIConsultationResponse {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and map the response
      return {
        recommendation: {
          recommendedCard: parsed.recommendation?.recommendedCard || 'Unknown',
          reasoning: parsed.recommendation?.reasoning || 'No reasoning provided',
          creditImpact: parsed.recommendation?.creditImpact || 'neutral',
          impactExplanation: parsed.recommendation?.impactExplanation || 'No impact explanation'
        },
        alternatives: parsed.alternatives?.map((alt: any) => ({
          cardId: alt.cardId || '',
          cardName: alt.cardName || 'Unknown Card',
          pros: alt.pros || [],
          cons: alt.cons || []
        })) || [],
        tips: parsed.tips || []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return a fallback response
      return {
        recommendation: {
          recommendedCard: userCards[0]?.name || 'Unknown',
          reasoning: 'Unable to parse AI response. Please try again.',
          creditImpact: 'neutral',
          impactExplanation: 'Unable to determine impact.'
        },
        alternatives: [],
        tips: ['Consider your credit utilization when making purchases.', 'Pay off balances in full when possible.']
      };
    }
  }

  async getGeneralCreditAdvice(question: string, userCards: CreditCard[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const cardsInfo = userCards.map(card => 
        `${card.name}: $${card.currentBalance}/${card.creditLimit} (${((card.currentBalance / card.creditLimit) * 100).toFixed(1)}% utilization)`
      ).join(', ');

      const prompt = `You are a financial advisor. The user has these credit cards: ${cardsInfo}

User question: ${question}

Provide helpful, actionable advice about credit management, spending optimization, and credit score improvement. Keep your response concise and practical.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting general advice:', error);
      return 'I apologize, but I encountered an error while processing your question. Please try again.';
    }
  }
}

export default new GeminiService();
