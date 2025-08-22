import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

export const AIInsights: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();

  const insights = [
    {
      type: 'opportunity',
      title: 'High Yield Opportunity Detected',
      description: 'USDC lending on Polygon showing 18.2% APY - 4.3% above average',
      confidence: 94,
      icon: TrendingUp,
      color: 'green',
    },
    {
      type: 'risk',
      title: 'Market Volatility Alert',
      description: 'ETH collateral ratios dropping - consider reducing exposure',
      confidence: 87,
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      type: 'optimization',
      title: 'Portfolio Optimization',
      description: 'Rebalancing to cross-chain pools could increase yield by 2.8%',
      confidence: 91,
      icon: Target,
      color: 'blue',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
          <p className="text-slate-600 text-sm">Powered by Google Gemini</p>
        </div>
        <div className="ml-auto flex items-center space-x-2 text-sm text-green-600">
          <Zap className="w-4 h-4" />
          <span className="font-medium">Live Analysis</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  insight.color === 'green' ? 'bg-green-100 text-green-600' :
                  insight.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.confidence >= 90 ? 'bg-green-100 text-green-700' :
                        insight.confidence >= 80 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {insight.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button 
          onClick={() => {
            if (!isConnected) {
              connectWallet();
            } else {
              // Show a proper notification instead of alert
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
              notification.innerHTML = `
                <div class="flex items-center space-x-2">
                  <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span>🤖 AI analyzing portfolio... New recommendations coming soon!</span>
                </div>
              `;
              document.body.appendChild(notification);
              
              // Animate in
              setTimeout(() => notification.classList.remove('translate-x-full'), 100);
              
              // Remove after 5 seconds
              setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => document.body.removeChild(notification), 300);
              }, 5000);
            }
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          Get More AI Recommendations
        </button>
      </div>
    </div>
  );
};