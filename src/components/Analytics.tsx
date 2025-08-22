import React from 'react';
import { TrendingUp, BarChart3, Target, Calendar, DollarSign, Activity } from 'lucide-react';

export const Analytics: React.FC = () => {
  const performanceMetrics = [
    { label: 'Total Return', value: '+15.8%', period: '30 days', trend: 'up' },
    { label: 'Best Performing Pool', value: 'USDT/BSC', apy: '18.4%', trend: 'up' },
    { label: 'Average Hold Time', value: '23 days', change: '+2 days', trend: 'up' },
    { label: 'Success Rate', value: '94.2%', change: '+1.8%', trend: 'up' },
  ];

  const monthlyData = [
    { month: 'Jan', earnings: 420, apy: 12.5 },
    { month: 'Feb', earnings: 580, apy: 13.2 },
    { month: 'Mar', earnings: 750, apy: 14.1 },
    { month: 'Apr', earnings: 890, apy: 15.3 },
    { month: 'May', earnings: 1120, apy: 16.2 },
    { month: 'Jun', earnings: 1347, apy: 14.6 },
  ];

  const insights = [
    {
      title: 'Best Time to Lend',
      description: 'Tuesday-Thursday show 12% higher average APY',
      actionable: true,
    },
    {
      title: 'Chain Performance',
      description: 'ZetaChain pools outperformed by 3.2% this month',
      actionable: true,
    },
    {
      title: 'Risk vs Reward',
      description: 'Your current portfolio sits in the optimal risk zone',
      actionable: false,
    },
    {
      title: 'Compound Frequency',
      description: 'Daily compounding could increase returns by 2.1%',
      actionable: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-2">Deep insights into your lending performance and market trends</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">{metric.label}</h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
            {metric.period && (
              <p className="text-sm text-slate-600">{metric.period}</p>
            )}
            {metric.apy && (
              <p className="text-sm text-green-600 font-medium">{metric.apy} APY</p>
            )}
            {metric.change && (
              <p className="text-sm text-green-600 font-medium">{metric.change}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Monthly Earnings & APY Trends
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">6M</button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">1Y</button>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-slate-600 font-medium">{data.month}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(data.earnings / 1400) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">${data.earnings}</span>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-slate-600 text-right">{data.apy}%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total earned this period</span>
              <span className="font-semibold text-green-600">$4,107</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-500" />
            AI Insights
          </h3>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border border-slate-100">
                <h4 className="font-medium text-slate-900 mb-2">{insight.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                {insight.actionable && (
                  <button 
                    onClick={() => {
                      alert(`Taking action on: ${insight.title}. This feature will be implemented in the next update!`);
                    }}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium hover:bg-purple-200 transition-colors"
                  >
                    Take Action
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Performance Summary
            </h3>
            <p className="text-green-100">
              Your portfolio is performing 23% better than market average with optimal risk distribution
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold">+15.8%</p>
              <p className="text-sm text-green-100">Total Return</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">94.2%</p>
              <p className="text-sm text-green-100">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">14.6%</p>
              <p className="text-sm text-green-100">Avg APY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};