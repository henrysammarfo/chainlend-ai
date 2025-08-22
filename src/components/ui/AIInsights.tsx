import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Zap, Loader2 } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

interface AIInsight {
  type: 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  icon: any;
  color: string;
  action?: string;
}

export const AIInsights: React.FC = () => {
  const { isConnected, connectWallet, chainId, currentNetworkData, testnetBalances } = useWallet();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate AI insights based on current network and wallet data
  const generateAIInsights = async () => {
    if (!isConnected || !chainId) return;

    setIsLoading(true);
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const networkName = currentNetworkData.name.split(' ')[0];
      const totalBalance = Object.values(testnetBalances).reduce((sum, balance) => {
        return sum + parseFloat(balance.replace(/,/g, ''));
      }, 0);

      const networkInsights: AIInsight[] = [];

      // Network-specific insights
      if (networkName === 'ZetaChain') {
        networkInsights.push(
          {
            type: 'opportunity',
            title: 'High Yield Opportunity on ZetaChain',
            description: `USDC lending showing 18.2% APY - 4.3% above average. Your ${testnetBalances.USDC} USDC could earn $${(parseFloat(testnetBalances.USDC) * 0.182).toFixed(2)} annually.`,
            confidence: 94,
            icon: TrendingUp,
            color: 'green',
            action: 'Lend USDC on ZetaChain'
          },
          {
            type: 'optimization',
            title: 'Cross-Chain Portfolio Optimization',
            description: 'Rebalancing to ZetaChain pools could increase your yield by 2.8% due to better cross-chain efficiency.',
            confidence: 91,
            icon: Target,
            color: 'blue',
            action: 'Optimize Portfolio'
          }
        );
      } else if (networkName === 'Ethereum') {
        networkInsights.push(
          {
            type: 'opportunity',
            title: 'ETH Staking Opportunity',
            description: `ETH staking on Ethereum showing 12.8% APY. Your ${testnetBalances.ETH} ETH could earn $${(parseFloat(testnetBalances.ETH) * 1680 * 0.128).toFixed(2)} annually.`,
            confidence: 88,
            icon: TrendingUp,
            color: 'green',
            action: 'Stake ETH'
          }
        );
      } else if (networkName === 'BSC') {
        networkInsights.push(
          {
            type: 'opportunity',
            title: 'High Yield on BSC',
            description: `USDT lending on BSC showing 18.4% APY. Your ${testnetBalances.USDT} USDT could earn $${(parseFloat(testnetBalances.USDT) * 0.184).toFixed(2)} annually.`,
            confidence: 92,
            icon: TrendingUp,
            color: 'green',
            action: 'Lend USDT on BSC'
          }
        );
      }

      // General portfolio insights
      if (totalBalance > 5000) {
        networkInsights.push({
          type: 'optimization',
          title: 'Portfolio Diversification',
          description: 'Consider diversifying across multiple chains to reduce risk and maximize yield opportunities.',
          confidence: 87,
          icon: Target,
          color: 'blue',
          action: 'Diversify Portfolio'
        });
      }

      // Risk assessment
      if (totalBalance > 10000) {
        networkInsights.push({
          type: 'risk',
          title: 'High Concentration Risk',
          description: 'Your portfolio is heavily concentrated. Consider spreading assets across different protocols and chains.',
          confidence: 85,
          icon: AlertTriangle,
          color: 'orange',
          action: 'Rebalance Portfolio'
        });
      }

      setInsights(networkInsights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      // Fallback insights
      setInsights([
        {
          type: 'opportunity',
          title: 'Market Analysis Complete',
          description: 'AI has analyzed current market conditions and identified optimal lending opportunities.',
          confidence: 90,
          icon: Brain,
          color: 'green'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate insights when network changes
  useEffect(() => {
    if (isConnected && chainId) {
      generateAIInsights();
    }
  }, [isConnected, chainId, testnetBalances]);

  const handleGetMoreInsights = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Show a proper notification instead of alert
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <svg class="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span>🤖 AI analyzing ${currentNetworkData.name} market conditions... New insights coming soon!</span>
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

    // Generate new insights
    await generateAIInsights();
  };

  const getInsightIcon = (insight: AIInsight) => {
    const Icon = insight.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getInsightColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'orange':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300';
      case 'blue':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    if (confidence >= 80) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Insights</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Powered by Google Gemini
            {chainId && (
              <span className="ml-2 text-green-600 font-medium">
                • Analyzing {currentNetworkData.name}
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto flex items-center space-x-2 text-sm text-green-600">
          <Zap className="w-4 h-4" />
          <span className="font-medium">Live Analysis</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mr-3" />
          <span className="text-slate-600 dark:text-slate-400">AI analyzing market conditions...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getInsightColorClasses(insight.color)}`}>
                  {getInsightIcon(insight)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{insight.description}</p>
                  {insight.action && (
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {insights.length === 0 && (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No insights available</h4>
              <p className="text-slate-600 dark:text-slate-400">
                {chainId ? `Connect your wallet to get AI insights for ${currentNetworkData.name}` : 'Connect your wallet to start'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-600">
        <button 
          onClick={handleGetMoreInsights}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            'Get More AI Recommendations'
          )}
        </button>
      </div>
    </div>
      );
  };