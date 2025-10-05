import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreditCard, AIConsultationRequest, AIConsultationResponse } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private responseCache: Map<string, any> = new Map();
  private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Pre-initialize the model for better performance
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          maxOutputTokens: 1000, // Limit response length for faster responses
          temperature: 0.3, // Lower temperature for more consistent, faster responses
          topP: 0.8,
          topK: 40
        }
      });
    } else {
      console.warn('Gemini API key not set or is placeholder. Using mock responses.');
    }
  }

  async getPurchaseRecommendation(
    request: AIConsultationRequest,
    userCards: CreditCard[]
  ): Promise<AIConsultationResponse> {
    try {
      console.log('GeminiService: Starting purchase consultation...');
      
      // Create cache key for similar requests
      const cacheKey = this.createCacheKey(request, userCards);
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log('Returning cached response');
        return cachedResponse;
      }
      
      if (this.model) {
        console.log('Using Gemini API...');
        
        // Use optimized prompt
        const prompt = this.buildOptimizedConsultationPrompt(request, userCards);
        console.log('Sending optimized prompt to Gemini...');
        
        const startTime = Date.now();
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const duration = Date.now() - startTime;
        console.log(`Gemini response received in ${duration}ms`);

        const parsedResponse = this.parseAIResponse(text, userCards);
        
        // Cache the response
        this.cacheResponse(cacheKey, parsedResponse);
        
        return parsedResponse;
      } else {
        console.log('Using mock response...');
        return this.getMockPurchaseRecommendation(request, userCards);
      }
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      // Fallback to mock response on error
      console.log('Falling back to mock response...');
      return this.getMockPurchaseRecommendation(request, userCards);
    }
  }

  private buildOptimizedConsultationPrompt(request: AIConsultationRequest, userCards: CreditCard[]): string {
    // Optimized prompt - shorter and more focused
    const cardsSummary = userCards.map(card => 
      `${card.name}: $${card.currentBalance}/${card.creditLimit} (${((card.currentBalance / card.creditLimit) * 100).toFixed(1)}%), ${card.rewards.rate}% ${card.rewards.type}, ${card.interestRate}% APR`
    ).join(' | ');

    return `Credit advisor: User has cards: ${cardsSummary}. 
Purchase: $${request.purchaseAmount} ${request.purchaseCategory} - ${request.description}
${request.preferredCard ? `Preferred: ${request.preferredCard}` : ''}

Respond with JSON only:
{
  "recommendation": {
    "recommendedCard": "card name",
    "reasoning": "Brief reasoning with numbers",
    "creditImpact": "positive|neutral|negative", 
    "impactExplanation": "brief impact"
  },
  "alternatives": [{"cardId": "id", "cardName": "name", "pros": ["pro"], "cons": ["con"]}],
  "tips": ["tip1", "tip2"]
}`;
  }

  private buildConsultationPrompt(request: AIConsultationRequest, userCards: CreditCard[]): string {
    const cardsInfo = userCards.map(card => 
      `Card: ${card.name} (${card.issuer})
- Credit Limit: $${card.creditLimit.toLocaleString()}
- Current Balance: $${card.currentBalance.toLocaleString()}
- Available Credit: $${card.availableCredit.toLocaleString()}
- Interest Rate: ${card.interestRate}%
- Minimum Payment: $${card.minimumPayment}
- Rewards: ${card.rewards.type} at ${card.rewards.rate}% rate
- Utilization: ${((card.currentBalance / card.creditLimit) * 100).toFixed(1)}%
- Due Date: ${card.dueDate}
- Last Payment: ${card.lastPaymentDate || 'No recent payments'}
- Last Payment Amount: ${card.lastPaymentAmount ? `$${card.lastPaymentAmount}` : 'N/A'}`
    ).join('\n\n');

    return `You are a direct, no-nonsense financial advisor helping with credit card purchase decisions. 

User's Credit Cards with complete details:
${cardsInfo}

Purchase Details:
- Amount: $${request.purchaseAmount}
- Category: ${request.purchaseCategory}
- Description: ${request.description}
${request.preferredCard ? `- Preferred Card: ${request.preferredCard}` : ''}

Provide a recommendation in the following JSON format with concrete, actionable guidance:
{
  "recommendation": {
    "recommendedCard": "Card name",
    "reasoning": "Single paragraph with specific numbers, exact payment amounts, reward calculations, interest savings, credit score impact numbers, and concrete timeline recommendations. Be direct and practical.",
    "creditImpact": "positive|neutral|negative",
    "impactExplanation": "Specific percentage impact on credit score with exact numbers and timeline"
  },
  "alternatives": [
    {
      "cardId": "card-id",
      "cardName": "Card name",
      "pros": ["specific advantage with numbers"],
      "cons": ["specific disadvantage with numbers"]
    }
  ],
  "tips": [
    "Concrete tip with specific numbers and actionable steps",
    "Another concrete tip with exact amounts and timeline"
  ]
}

Focus on:
- Specific utilization targets with exact percentages
- Exact payment amounts and interest savings calculations
- Reward optimization strategies with specific dollar amounts
- Credit score impact numbers with concrete timeline
- Payment due dates and cash flow optimization
- Concrete timeline recommendations

Provide practical, actionable advice with specific numbers and calculations.`;
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
      console.log('GeminiService: Starting API call...');
      
      // Create cache key for similar questions
      const cacheKey = `advice_${question.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log('Returning cached advice response');
        return cachedResponse;
      }
      
      if (this.model) {
        console.log('Using Gemini API...');

        // Optimized prompt - shorter and more direct
        const cardsSummary = userCards.map(card => 
          `${card.name}: ${((card.currentBalance / card.creditLimit) * 100).toFixed(1)}% util`
        ).join(', ');

        const prompt = `Financial advisor. Cards: ${cardsSummary}. Question: ${question}. Give concise, actionable advice in 1-2 sentences.`;

        console.log('Sending optimized prompt to Gemini...');
        const startTime = Date.now();
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const duration = Date.now() - startTime;
        console.log(`Gemini advice received in ${duration}ms`);
        
        // Cache the response
        this.cacheResponse(cacheKey, text);
        
        return text;
      } else {
        console.log('Using mock response...');
        return this.getMockGeneralAdvice(question, userCards);
      }
    } catch (error) {
      console.error('Error getting general advice:', error);
      // Fallback to mock response
      console.log('Falling back to mock response...');
      return this.getMockGeneralAdvice(question, userCards);
    }
  }

  private getMockPurchaseRecommendation(
    request: AIConsultationRequest,
    userCards: CreditCard[]
  ): AIConsultationResponse {
    // Find the best card for the purchase based on rewards and utilization
    const bestCard = userCards.reduce((best, card) => {
      const bestUtilization = best.currentBalance / best.creditLimit;
      const currentUtilization = card.currentBalance / card.creditLimit;
      
      // Prefer cards with lower utilization and higher rewards
      if (currentUtilization < bestUtilization || 
          (currentUtilization === bestUtilization && card.rewards.rate > best.rewards.rate)) {
        return card;
      }
      return best;
    });

    const utilizationAfterPurchase = (bestCard.currentBalance + request.purchaseAmount) / bestCard.creditLimit;
    const creditImpact = utilizationAfterPurchase > 0.3 ? 'negative' : utilizationAfterPurchase > 0.1 ? 'neutral' : 'positive';

    return {
      recommendation: {
        recommendedCard: bestCard.name,
        reasoning: `Based on your current credit utilization and rewards structure, I recommend using your ${bestCard.name} for this $${request.purchaseAmount} ${request.purchaseCategory} purchase. This card offers ${bestCard.rewards.rate}% ${bestCard.rewards.type} rewards, and your utilization will remain at ${(utilizationAfterPurchase * 100).toFixed(1)}% after this purchase. Pay off the balance within the grace period to avoid interest charges of $${(request.purchaseAmount * bestCard.interestRate / 100 / 12).toFixed(2)} per month.`,
        creditImpact,
        impactExplanation: creditImpact === 'positive' 
          ? 'This purchase will help maintain low utilization, potentially improving your credit score'
          : creditImpact === 'negative'
          ? 'This purchase will increase your utilization above 30%, which may negatively impact your credit score'
          : 'This purchase will have minimal impact on your credit score'
      },
      alternatives: userCards.filter(card => card.id !== bestCard.id).map(card => ({
        cardId: card.id,
        cardName: card.name,
        pros: [
          `${card.rewards.rate}% ${card.rewards.type} rewards`,
          `Current utilization: ${((card.currentBalance / card.creditLimit) * 100).toFixed(1)}%`
        ],
        cons: [
          card.interestRate > bestCard.interestRate ? `Higher interest rate (${card.interestRate}%)` : '',
          card.currentBalance > bestCard.currentBalance ? 'Higher current balance' : ''
        ].filter(Boolean)
      })),
      tips: [
        `Pay off this purchase by ${bestCard.dueDate} to avoid interest charges`,
        `Consider setting up automatic payments to avoid late fees`,
        `Monitor your credit utilization to keep it below 30% for optimal credit score impact`
      ]
    };
  }

  private getMockGeneralAdvice(question: string, userCards: CreditCard[]): string {
    const totalUtilization = userCards.reduce((sum, card) => {
      return sum + (card.currentBalance / card.creditLimit);
    }, 0) / userCards.length;

    const avgUtilization = (totalUtilization * 100).toFixed(1);

    if (question.toLowerCase().includes('utilization') || question.toLowerCase().includes('credit score')) {
      return `Your current average credit utilization is ${avgUtilization}%. To improve your credit score, aim to keep utilization below 30%. Consider paying down your highest balance cards first, and avoid making large purchases that would push your utilization above this threshold. Your credit score can improve significantly by maintaining low utilization over time.`;
    }

    if (question.toLowerCase().includes('payment') || question.toLowerCase().includes('pay off')) {
      return `Focus on paying off your highest interest rate cards first to minimize interest charges. Set up automatic payments for at least the minimum amount to avoid late fees, which can hurt your credit score. If possible, pay more than the minimum to reduce your principal balance faster.`;
    }

    if (question.toLowerCase().includes('reward') || question.toLowerCase().includes('cashback')) {
      return `Your cards offer different reward structures. Use your highest reward rate card for purchases in categories where it offers the most value. Remember that rewards are only beneficial if you pay off your balance in full each month to avoid interest charges that could exceed the reward value.`;
    }

    // Default advice
    const utilizationNum = parseFloat(avgUtilization);
    return `Based on your current credit card situation, I recommend focusing on maintaining low credit utilization (below 30%), paying off high-interest balances first, and making payments on time. Your average utilization of ${avgUtilization}% ${utilizationNum > 30 ? 'could be improved' : 'is in a good range'}. Consider setting up automatic payments and monitoring your credit score regularly for optimal financial health.`;
  }

  // Caching utilities
  private createCacheKey(request: AIConsultationRequest, userCards: CreditCard[]): string {
    const cardsKey = userCards.map(card => `${card.id}_${card.currentBalance}_${card.creditLimit}`).join('|');
    return `purchase_${request.purchaseAmount}_${request.purchaseCategory}_${cardsKey}`;
  }

  private getCachedResponse(key: string): any {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_EXPIRY) {
      return cached.data;
    }
    // Remove expired cache
    if (cached) {
      this.responseCache.delete(key);
    }
    return null;
  }

  private cacheResponse(key: string, data: any): void {
    this.responseCache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries if map gets too large
    if (this.responseCache.size > 50) {
      const oldestKey = this.responseCache.keys().next().value;
      if (oldestKey) {
        this.responseCache.delete(oldestKey);
      }
    }
  }
}

export default new GeminiService();
