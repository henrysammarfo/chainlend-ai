import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Shield, Zap } from 'lucide-react';
import { PoolCard } from './ui/PoolCard';
import { useWallet } from '../contexts/WalletContext';

export const LendingPools: React.FC = () => {
  const { isConnected, connectWallet, chainId, currentNetworkData } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Dynamic pools based on current network
  const getNetworkPools = (chainId: number | null) => {
    const basePools = [
      {
        token: 'USDC',
        chain: 'ZetaChain',
        apy: '15.2%',
        tvl: '$1.2M',
        available: '$340K',
        risk: 'Low',
        aiScore: 95,
        chainColor: 'bg-green-500',
      },
      {
        token: 'ETH',
        chain: 'Ethereum',
        apy: '12.8%',
        tvl: '$2.1M',
        available: '$780K',
        risk: 'Medium',
        aiScore: 88,
        chainColor: 'bg-blue-500',
      },
      {
        token: 'USDT',
        chain: 'BSC',
        apy: '18.4%',
        tvl: '$890K',
        available: '$210K',
        risk: 'Medium',
        aiScore: 92,
        chainColor: 'bg-yellow-500',
      },
      {
        token: 'DAI',
        chain: 'Polygon',
        apy: '11.6%',
        tvl: '$1.5M',
        available: '$450K',
        risk: 'Low',
        aiScore: 90,
        chainColor: 'bg-purple-500',
      },
      {
        token: 'AVAX',
        chain: 'Avalanche',
        apy: '14.7%',
        tvl: '$650K',
        available: '$180K',
        risk: 'High',
        aiScore: 79,
        chainColor: 'bg-red-500',
      },
      {
        token: 'BNB',
        chain: 'BSC',
        apy: '13.9%',
        tvl: '$980K',
        available: '$320K',
        risk: 'Medium',
        aiScore: 85,
        chainColor: 'bg-yellow-500',
      },
    ];

    // Filter pools based on current network
    if (chainId) {
      const networkName = currentNetworkData.name.split(' ')[0]; // Extract network name
      return basePools.filter(pool => 
        pool.chain.toLowerCase().includes(networkName.toLowerCase()) ||
        networkName.toLowerCase().includes(pool.chain.toLowerCase())
      );
    }

    return basePools;
  };

  const [pools, setPools] = useState(getNetworkPools(chainId));

  // Update pools when network changes
  useEffect(() => {
    setPools(getNetworkPools(chainId));
  }, [chainId, currentNetworkData]);

  const filters = [
    { id: 'all', label: 'All Pools' },
    { id: 'high-apy', label: 'High APY' },
    { id: 'low-risk', label: 'Low Risk' },
    { id: 'ai-recommended', label: 'AI Recommended' },
  ];

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.chain.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (selectedFilter) {
      case 'high-apy':
        return parseFloat(pool.apy) > 15;
      case 'low-risk':
        return pool.risk === 'Low';
      case 'ai-recommended':
        return pool.aiScore > 90;
      default:
        return true;
    }
  });

  const handleAutoInvest = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Lending Pools</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Discover cross-chain lending opportunities with AI-powered recommendations
          {chainId && (
            <span className="ml-2 text-green-600 font-medium">
              • Connected to {currentNetworkData.name}
            </span>
          )}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Optimization Available</h3>
              <p className="text-purple-100">
                {chainId ? `Connected to ${currentNetworkData.name} - Ready for real transactions!` : 'Connect your wallet to start!'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleAutoInvest}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              {isConnected ? 'Enable Auto-Invest' : 'Connect Wallet'}
            </button>
            <button
              onClick={() => window.open('https://cloud.google.com/application/web3/faucet/zetachain/testnet', '_blank')}
              className="bg-white/20 text-white px-4 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Get Testnet Tokens
            </button>
          </div>
        </div>
      </div>

      {/* Pool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool, index) => (
          <PoolCard key={index} pool={pool} />
        ))}
      </div>

      {filteredPools.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No pools found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};