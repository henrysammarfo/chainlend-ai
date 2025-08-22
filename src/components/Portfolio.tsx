import React from 'react';
import { Wallet, TrendingUp, BarChart3, PieChart, Target, ArrowUpRight } from 'lucide-react';
import { WithdrawModal } from './ui/WithdrawModal';
import { getCoinLogo } from '../utils/coinLogos';

export const Portfolio: React.FC = () => {
  const { testnetBalances } = useWallet();
  const [selectedPosition, setSelectedPosition] = React.useState<any>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);

  const portfolioStats = [
    { label: 'Total Balance', value: '$12,847.50', change: '+5.2%', trend: 'up' },
    { label: 'Active Positions', value: '8', change: '+2', trend: 'up' },
    { label: 'Total Earned', value: '$1,247.83', change: '+12.8%', trend: 'up' },
    { label: 'Average APY', value: '14.6%', change: '+0.8%', trend: 'up' },
  ];

  const positions = [
    {
      token: 'USDC',
      chain: 'ZetaChain',
      amount: testnetBalances.USDC || '5,000.00',
      value: `$${testnetBalances.USDC || '5,000.00'}`,
      apy: '15.2%',
      earned: '$456.78',
      chainColor: 'bg-green-500',
    },
    {
      token: 'ETH',
      chain: 'Ethereum',
      amount: testnetBalances.ETH || '2.5',
      value: `$${(parseFloat(testnetBalances.ETH || '2.5') * 1680).toFixed(2)}`,
      apy: '12.8%',
      earned: '$312.45',
      chainColor: 'bg-blue-500',
    },
    {
      token: 'USDT',
      chain: 'BSC',
      amount: testnetBalances.USDT || '2,000.00',
      value: `$${testnetBalances.USDT || '2,000.00'}`,
      apy: '18.4%',
      earned: '$234.67',
      chainColor: 'bg-yellow-500',
    },
    {
      token: 'DAI',
      chain: 'Polygon',
      amount: testnetBalances.DAI || '1,500.00',
      value: `$${testnetBalances.DAI || '1,500.00'}`,
      apy: '11.6%',
      earned: '$187.23',
      chainColor: 'bg-purple-500',
    },
  ];

  const chainDistribution = [
    { chain: 'ZetaChain', percentage: 39, color: 'bg-green-500' },
    { chain: 'Ethereum', percentage: 33, color: 'bg-blue-500' },
    { chain: 'BSC', percentage: 16, color: 'bg-yellow-500' },
    { chain: 'Polygon', percentage: 12, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
          <p className="text-slate-600 mt-2">Track your cross-chain lending performance and optimize returns</p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Optimize Portfolio</span>
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">{stat.label}</h3>
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Positions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-500" />
              Active Positions
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage All
            </button>
          </div>

          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={getCoinLogo(position.token)} 
                      alt={position.token}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/40/6366f1/ffffff?text=${position.token.slice(0, 2)}`;
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-slate-900">{position.token}</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${position.chainColor}`} />
                        <span className="text-sm text-slate-600">{position.chain}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{position.value}</p>
                    <p className="text-sm text-green-600 font-medium">{position.apy} APY</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Amount</p>
                    <p className="font-medium text-slate-900">{position.amount} {position.token}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Earned</p>
                    <p className="font-medium text-green-600">${position.earned}</p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <button 
                    onClick={() => {
                      setSelectedPosition(position);
                      setIsWithdrawModalOpen(true);
                    }}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                  >
                    Add More
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedPosition(position);
                      setIsWithdrawModalOpen(true);
                    }}
                    className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chain Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-500" />
            Chain Distribution
          </h3>

          <div className="space-y-4">
            {chainDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-slate-900">{item.chain}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Optimization Tip</span>
            </div>
            <p className="text-sm text-green-700">
              Consider rebalancing to ZetaChain for higher yields and better cross-chain efficiency.
            </p>
          </div>
        </div>
      </div>

      {selectedPosition && (
        <WithdrawModal 
          isOpen={isWithdrawModalOpen}
          onClose={() => {
            setIsWithdrawModalOpen(false);
            setSelectedPosition(null);
          }}
          position={selectedPosition}
        />
      )}
    </div>
  );
};