import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Brain,
  ChevronRight,
  Activity,
  Globe
} from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { ChainSelector } from './ui/ChainSelector';
import { AIInsights } from './ui/AIInsights';
// import { ZetaChainStatus } from './ui/ZetaChainStatus';
import { useWallet } from '../contexts/WalletContext';

interface DashboardProps {
  setActiveTab?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { isConnected, connectWallet, chainId, currentNetworkData, testnetBalances } = useWallet();

  // Dynamic stats based on current network
  const getNetworkStats = () => {
    const baseStats = [
      {
        title: 'Total Value Locked',
        value: '$2.4M',
        change: '+12.3%',
        trend: 'up' as const,
        icon: DollarSign,
      },
      {
        title: 'Active Lenders',
        value: '1,247',
        change: '+8.1%',
        trend: 'up' as const,
        icon: Users,
      },
      {
        title: 'Average APY',
        value: '14.2%',
        change: '-0.3%',
        trend: 'down' as const,
        icon: TrendingUp,
      },
      {
        title: 'Cross-Chain Volume',
        value: '$842K',
        change: '+24.7%',
        trend: 'up' as const,
        icon: Globe,
      },
    ];

    // Adjust stats based on network
    if (chainId) {
      const networkName = currentNetworkData.name.split(' ')[0];
      return baseStats.map(stat => {
        if (stat.title === 'Total Value Locked') {
          return {
            ...stat,
            value: networkName === 'ZetaChain' ? '$3.2M' : 
                   networkName === 'Ethereum' ? '$4.1M' : 
                   networkName === 'BSC' ? '$1.8M' : 
                   networkName === 'Polygon' ? '$2.7M' : 
                   networkName === 'Avalanche' ? '$1.5M' : stat.value
          };
        }
        if (stat.title === 'Average APY') {
          return {
            ...stat,
            value: networkName === 'ZetaChain' ? '16.8%' : 
                   networkName === 'Ethereum' ? '13.5%' : 
                   networkName === 'BSC' ? '19.2%' : 
                   networkName === 'Polygon' ? '12.1%' : 
                   networkName === 'Avalanche' ? '15.7%' : stat.value
          };
        }
        return stat;
      });
    }

    return baseStats;
  };

  const stats = getNetworkStats();

  // Dynamic recent activity based on network
  const getRecentActivity = () => {
    const baseActivity = [
      { type: 'Lend', amount: '500 USDC', chain: 'Ethereum', time: '2 mins ago', apy: '12.4%' },
      { type: 'Borrow', amount: '0.8 ETH', chain: 'ZetaChain', time: '5 mins ago', apy: '8.2%' },
      { type: 'Repay', amount: '1000 USDT', chain: 'BSC', time: '12 mins ago', apy: '15.1%' },
      { type: 'Withdraw', amount: '750 DAI', chain: 'Polygon', time: '18 mins ago', apy: '11.8%' },
    ];

    if (chainId) {
      const networkName = currentNetworkData.name.split(' ')[0];
      return baseActivity.filter(activity => 
        activity.chain.toLowerCase().includes(networkName.toLowerCase()) ||
        networkName.toLowerCase().includes(activity.chain.toLowerCase())
      );
    }

    return baseActivity;
  };

  const recentActivity = getRecentActivity();

  const handleViewOpportunities = () => {
    if (!isConnected) {
      connectWallet();
    } else {
      // Show a proper notification instead of alert
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span>🚀 Navigating to lending opportunities on ${currentNetworkData.name}!</span>
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

      // Navigate to lending pools
      if (setActiveTab) {
        setActiveTab('lending');
      }
    }
  };

  const handleAutoInvest = () => {
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
          <span>🤖 Auto-invest enabled on ${currentNetworkData.name}! AI optimizing your portfolio...</span>
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage your cross-chain lending portfolio with AI-powered insights
            {chainId && (
              <span className="ml-2 text-green-600 font-medium">
                • Connected to {currentNetworkData.name}
              </span>
            )}
          </p>
        </div>
        <ChainSelector />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Insights */}
        <div className="lg:col-span-2">
          <AIInsights />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* ZetaChain Status - Temporarily disabled */}
          {/* <ZetaChainStatus /> */}
          
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
                {chainId && (
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    on {currentNetworkData.name}
                  </span>
                )}
              </h3>
              <button 
                onClick={() => setActiveTab && setActiveTab('lending')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      activity.type === 'Lend' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      activity.type === 'Borrow' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      activity.type === 'Repay' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    }`}>
                      {activity.type[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{activity.amount}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{activity.chain} • {activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{activity.apy}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">APY</p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {chainId ? `No recent activity on ${currentNetworkData.name}` : 'Connect wallet to see activity'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Ready to maximize your yields on {chainId ? currentNetworkData.name : 'multiple chains'}?
            </h3>
            <p className="text-green-100">
              {chainId 
                ? `Our AI has identified optimal lending opportunities on ${currentNetworkData.name}`
                : 'Our AI has identified optimal lending opportunities across 5 chains'
              }
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleViewOpportunities}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              {isConnected ? 'View Opportunities' : 'Connect Wallet'}
            </button>
            <button 
              onClick={handleAutoInvest}
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              {isConnected ? 'Auto-Invest' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};