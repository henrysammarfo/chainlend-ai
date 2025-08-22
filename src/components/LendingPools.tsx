import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Shield, Zap } from 'lucide-react';
import { PoolCard } from './ui/PoolCard';
import { useWallet } from '../contexts/WalletContext';

export const LendingPools: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const pools = [
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lending Pools</h1>
        <p className="text-slate-600 mt-2">Discover cross-chain lending opportunities with AI-powered recommendations</p>
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
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
              <p className="text-purple-100">Using ZetaChain testnet - Try with real wallet connection!</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                if (!isConnected) {
                  connectWallet();
                } else {
                  alert('🎉 Auto-invest enabled! AI will now automatically allocate your testnet funds to the best performing pools. This is a demo using ZetaChain testnet.');
                }
              }}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              {isConnected ? 'Enable Auto-Invest' : 'Connect Wallet'}
            </button>
            <button
              onClick={() => window.open('https://www.zetachain.com/docs/developers/testnet/', '_blank')}
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
          <h3 className="text-lg font-medium text-slate-900 mb-2">No pools found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};