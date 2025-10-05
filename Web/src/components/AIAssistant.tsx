import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import CreditService from '../services/CreditService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your credit assistant! 🎉 I can help you with credit questions, spending advice, and financial tips. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    "How can I improve my credit score?",
    "What's my credit utilization?",
    "Should I pay off my credit card?",
    "What's the best card for groceries?"
  ];

  // Initialize Gemini AI
  const initializeGemini = () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error('Gemini API key not found');
      return null;
    }
    return new GoogleGenerativeAI(apiKey);
  };

  const getMockResponse = (question: string, userCards: any[]): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('credit score') || lowerQuestion.includes('improve')) {
      return "To improve your credit score, focus on these key areas:\n\n• Pay bills on time (35% of your score)\n• Keep credit utilization below 30%\n• Maintain a mix of credit types\n• Avoid opening too many new accounts\n• Check your credit report regularly\n\nYour current cards show good utilization patterns. Keep it up! 🌟";
    }
    
    if (lowerQuestion.includes('utilization')) {
      const totalUtilization = userCards.length > 0 
        ? userCards.reduce((sum, card) => sum + (card.currentBalance / card.creditLimit), 0) / userCards.length * 100
        : 0;
      return `Your current credit utilization is ${totalUtilization.toFixed(1)}%. This is ${totalUtilization < 30 ? 'excellent' : totalUtilization < 50 ? 'good' : 'high'}! 🎯\n\nKeep utilization under 30% for the best credit score impact. Consider paying down balances or requesting credit limit increases.`;
    }
    
    if (lowerQuestion.includes('pay off') || lowerQuestion.includes('balance')) {
      return "Paying off credit card balances is always a great idea! 💳\n\nBenefits:\n• Reduces interest charges\n• Improves credit utilization\n• Boosts credit score\n• Saves money long-term\n\nStart with the highest interest rate card first, or the smallest balance for quick wins!";
    }
    
    if (lowerQuestion.includes('card') || lowerQuestion.includes('best')) {
      return "For choosing the best card, consider:\n\n• Rewards that match your spending\n• Interest rates if you carry balances\n• Annual fees vs. benefits\n• Credit requirements\n• Sign-up bonuses\n\nYour current cards offer good rewards. Use the one with the highest cashback for each purchase category! 🛒";
    }
    
    // Default response
    return "Great question! 💡 Here are some general credit tips:\n\n• Always pay on time\n• Keep balances low\n• Monitor your credit regularly\n• Use credit responsibly\n• Consider your financial goals\n\nFeel free to ask about specific credit topics - I'm here to help! 🌟";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Get user's credit cards for context
      const userCards = await CreditService.getCreditCards();
      console.log('User cards:', userCards);
      
      // Initialize Gemini AI
      const genAI = initializeGemini();
      let response: string;

      if (genAI) {
        console.log('Using Gemini API...');
        
        try {
          // Use gemini-2.5-flash model
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
          
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

          const prompt = `You are a direct, no-nonsense financial advisor. The user has these credit cards with complete details:

${cardsInfo}

User question: ${currentInput}

Give a single paragraph answer with concrete, actionable guidance. Include specific numbers, percentages, and exact steps to take. Be direct and practical. Focus on specific utilization targets, exact payment amounts, reward optimization strategies, interest savings calculations, credit score impact numbers, and concrete timeline recommendations. Keep it to one paragraph only.`;

          console.log('Sending prompt to Gemini...');
          const result = await model.generateContent(prompt);
          const geminiResponse = await result.response;
          response = geminiResponse.text();
          console.log('Gemini response received:', response);
        } catch (geminiError) {
          console.error('Gemini API error:', geminiError);
          response = getMockResponse(currentInput, userCards);
        }
      } else {
        console.log('Using mock response...');
        response = getMockResponse(currentInput, userCards);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later! 😅",
        isUser: false,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="glass rounded-full p-4 hover:scale-110 transition-all duration-300 group animate-float hover:animate-wiggle"
            aria-label="Open AI Assistant"
          >
            <div className="relative">
              {/* Cute Shooting Star SVG */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="group-hover:scale-110 transition-transform animate-happy-bounce"
              >
                {/* Rainbow shooting trail - behind the star */}
                <path d="M35 10 L40 5" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <path d="M33 12 L38 7" stroke="#ffa500" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <path d="M31 14 L36 9" stroke="#ffff00" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <path d="M29 16 L34 11" stroke="#32cd32" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <path d="M27 18 L32 13" stroke="#00bfff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <path d="M25 20 L30 15" stroke="#8a2be2" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                
                {/* Secondary rainbow trail */}
                <path d="M34 11 L39 6" stroke="#ff69b4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M32 13 L37 8" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M30 15 L35 10" stroke="#00ff7f" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M28 17 L33 12" stroke="#87ceeb" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M26 19 L31 14" stroke="#dda0dd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                
                {/* Main star body - proper 5-pointed star - in front */}
                <path d="M20 2 L24 14 L36 14 L27 22 L31 34 L20 26 L9 34 L13 22 L4 14 L16 14 Z" fill="#f4d03f" opacity="0.9" />
                
                {/* Star face - cute eyes */}
                <circle cx="17" cy="17" r="2" fill="white" />
                <circle cx="23" cy="17" r="2" fill="white" />
                <circle cx="17.5" cy="17.5" r="1" fill="#4a90e2" />
                <circle cx="23.5" cy="17.5" r="1" fill="#4a90e2" />
                <circle cx="17.8" cy="17.2" r="0.3" fill="white" />
                <circle cx="23.8" cy="17.2" r="0.3" fill="white" />
                
                {/* Blush cheeks */}
                <circle cx="15" cy="20" r="1.2" fill="#ffb6c1" opacity="0.7" />
                <circle cx="25" cy="20" r="1.2" fill="#ffb6c1" opacity="0.7" />
                
                {/* Sparkles around the star */}
                <circle cx="8" cy="8" r="0.8" fill="#ffd700" opacity="0.8" className="animate-sparkle" style={{ animationDelay: '0s' }} />
                <circle cx="32" cy="6" r="0.6" fill="#ffd700" opacity="0.8" className="animate-sparkle" style={{ animationDelay: '0.3s' }} />
                <circle cx="6" cy="24" r="0.7" fill="#ffd700" opacity="0.8" className="animate-sparkle" style={{ animationDelay: '0.6s' }} />
                <circle cx="34" cy="26" r="0.6" fill="#ffd700" opacity="0.8" className="animate-sparkle" style={{ animationDelay: '0.9s' }} />
                <circle cx="10" cy="34" r="0.7" fill="#ffd700" opacity="0.8" className="animate-sparkle" style={{ animationDelay: '1.2s' }} />
              </svg>
              
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50 glass rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {/* Rainbow shooting trail - behind the star */}
                  <path d="M21 6 L24 3" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M19.5 7.5 L22.5 4.5" stroke="#ffa500" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M18 9 L21 6" stroke="#ffff00" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M16.5 10.5 L19.5 7.5" stroke="#32cd32" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M15 12 L18 9" stroke="#00bfff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M13.5 13.5 L16.5 10.5" stroke="#8a2be2" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  
                  {/* Secondary rainbow trail */}
                  <path d="M20.25 6.75 L23.25 3.75" stroke="#ff69b4" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M18.75 8.25 L21.75 5.25" stroke="#ffd700" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M17.25 9.75 L20.25 6.75" stroke="#00ff7f" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M15.75 11.25 L18.75 8.25" stroke="#87ceeb" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M14.25 12.75 L17.25 9.75" stroke="#dda0dd" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  
                  {/* Main star body - proper 5-pointed star - in front */}
                  <path d="M12 1.5 L15 9 L22.5 9 L17.25 13.5 L19.5 21 L12 16.5 L4.5 21 L6.75 13.5 L1.5 9 L9 9 Z" fill="#f4d03f" opacity="0.9" />
                  
                  {/* Star face - cute eyes */}
                  <circle cx="10.5" cy="10.5" r="1" fill="white" />
                  <circle cx="13.5" cy="10.5" r="1" fill="white" />
                  <circle cx="10.8" cy="10.8" r="0.5" fill="#4a90e2" />
                  <circle cx="13.8" cy="10.8" r="0.5" fill="#4a90e2" />
                  <circle cx="11" cy="10.6" r="0.15" fill="white" />
                  <circle cx="14" cy="10.6" r="0.15" fill="white" />
                  
                  {/* Blush cheeks */}
                  <circle cx="9" cy="12" r="0.7" fill="#ffb6c1" opacity="0.7" />
                  <circle cx="15" cy="12" r="0.7" fill="#ffb6c1" opacity="0.7" />
                </svg>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Credit Assistant
                </h3>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick Actions - only show if it's the first message */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(action)}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-white/10 text-white/80 hover:bg-white/20' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-primary text-white'
                      : isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-white/70' : isDark ? 'text-white/50' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`px-3 py-2 rounded-2xl ${
                  isDark ? 'bg-white/10' : 'bg-gray-100'
                }`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about credit..."
                className={`flex-1 px-3 py-2 rounded-xl text-sm border-0 outline-none ${
                  isDark
                    ? 'bg-white/10 text-white placeholder-white/50'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="btn-primary p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;