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
import { useWallet } from '../contexts/WalletContext';

export const Dashboard: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();

  const stats = [
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

  const recentActivity = [
    { type: 'Lend', amount: '500 USDC', chain: 'Ethereum', time: '2 mins ago', apy: '12.4%' },
    { type: 'Borrow', amount: '0.8 ETH', chain: 'ZetaChain', time: '5 mins ago', apy: '8.2%' },
    { type: 'Repay', amount: '1000 USDT', chain: 'BSC', time: '12 mins ago', apy: '15.1%' },
    { type: 'Withdraw', amount: '750 DAI', chain: 'Polygon', time: '18 mins ago', apy: '11.8%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your cross-chain lending portfolio with AI-powered insights</p>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    activity.type === 'Lend' ? 'bg-green-100 text-green-700' :
                    activity.type === 'Borrow' ? 'bg-blue-100 text-blue-700' :
                    activity.type === 'Repay' ? 'bg-orange-100 text-orange-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {activity.type[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{activity.amount}</p>
                    <p className="text-xs text-slate-600">{activity.chain} • {activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{activity.apy}</p>
                  <p className="text-xs text-slate-600">APY</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to maximize your yields?</h3>
            <p className="text-green-100">Our AI has identified optimal lending opportunities across 5 chains</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => {
                if (!isConnected) {
                  connectWallet();
                } else {
                  alert('🚀 Navigating to lending opportunities! This demo uses ZetaChain testnet for safe testing.');
                }
              }}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              {isConnected ? 'View Opportunities' : 'Connect Wallet'}
            </button>
            <button 
              onClick={() => {
                if (!isConnected) {
                  connectWallet();
                } else {
                  alert('🤖 Auto-invest enabled! AI will now optimize your testnet portfolio automatically. No real funds at risk!');
                }
              }}
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