import React from 'react';
import { Wallet, TrendingUp, BarChart3, PieChart, Target, ArrowUpRight } from 'lucide-react';
import { WithdrawModal } from './ui/WithdrawModal';
import { getCoinLogo } from '../utils/coinLogos';
import { useWallet } from '../contexts/WalletContext';

export const Portfolio: React.FC = () => {
  const { testnetBalances, chainId, currentNetworkData } = useWallet();
  const [selectedPosition, setSelectedPosition] = React.useState<any>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);

  // Calculate portfolio stats based on current network
  const getPortfolioStats = () => {
    const totalBalance = Object.values(testnetBalances).reduce((sum, balance) => {
      return sum + parseFloat(balance.replace(/,/g, ''));
    }, 0);

    return [
      { 
        label: 'Total Balance', 
        value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        change: '+5.2%', 
        trend: 'up' as const 
      },
      { 
        label: 'Active Positions', 
        value: Object.values(testnetBalances).filter(b => parseFloat(b) > 0).length.toString(), 
        change: '+2', 
        trend: 'up' as const 
      },
      { 
        label: 'Total Earned', 
        value: `$${(totalBalance * 0.12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        change: '+12.8%', 
        trend: 'up' as const 
      },
      { 
        label: 'Average APY', 
        value: '14.6%', 
        change: '+0.8%', 
        trend: 'up' as const 
      },
    ];
  };

  const portfolioStats = getPortfolioStats();

  // Get positions based on current network
  const getPositions = () => {
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

    // Filter positions based on current network
    if (chainId) {
      const networkName = currentNetworkData.name.split(' ')[0];
      return positions.filter(position => 
        position.chain.toLowerCase().includes(networkName.toLowerCase()) ||
        networkName.toLowerCase().includes(position.chain.toLowerCase())
      );
    }

    return positions;
  };

  const positions = getPositions();

  const chainDistribution = [
    { chain: 'ZetaChain', percentage: 39, color: 'bg-green-500' },
    { chain: 'Ethereum', percentage: 33, color: 'bg-blue-500' },
    { chain: 'BSC', percentage: 16, color: 'bg-yellow-500' },
    { chain: 'Polygon', percentage: 12, color: 'bg-purple-500' },
  ];

  const handleWithdraw = (position: any) => {
    setSelectedPosition(position);
    setIsWithdrawModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Portfolio</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track your cross-chain lending performance and optimize returns
            {chainId && (
              <span className="ml-2 text-green-600 font-medium">
                • Connected to {currentNetworkData.name}
              </span>
            )}
          </p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Optimize Portfolio</span>
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</h3>
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Positions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-500" />
              Active Positions
            </h3>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {chainId ? `${positions.length} positions on ${currentNetworkData.name}` : 'All networks'}
            </div>
          </div>

          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 transition-colors">
                <div className="flex items-center space-x-4">
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
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{position.token}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${position.chainColor}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{position.chain}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{position.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{position.amount}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{position.apy}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">APY</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{position.earned}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Earned</p>
                </div>

                <button
                  onClick={() => handleWithdraw(position)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Withdraw
                </button>
              </div>
            ))}

            {positions.length === 0 && (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No active positions</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {chainId ? `No positions found on ${currentNetworkData.name}` : 'Connect your wallet to see your positions'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chain Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-500" />
            Chain Distribution
          </h3>
          
          <div className="space-y-4">
            {chainDistribution.map((chain, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${chain.color}`} />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{chain.chain}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{chain.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total Value</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ${Object.values(testnetBalances).reduce((sum, balance) => {
                  return sum + parseFloat(balance.replace(/,/g, ''));
                }, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        position={selectedPosition}
      />
    </div>
  );
};