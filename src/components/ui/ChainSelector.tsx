import React, { useState } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

const chains = [
  { id: 'all', name: 'All Chains', color: 'bg-slate-500', chainId: null, description: 'View opportunities across all supported networks' },
  { id: 'zetachain', name: 'ZetaChain', color: 'bg-green-500', chainId: 7001, description: 'Cross-chain hub with highest yields and lowest fees' },
  { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500', chainId: 11155111, description: 'Most secure network with established DeFi protocols' },
  { id: 'bsc', name: 'BSC', color: 'bg-yellow-500', chainId: 97, description: 'High-speed network with low transaction costs' },
  { id: 'polygon', name: 'Polygon', color: 'bg-purple-500', chainId: 80001, description: 'Ethereum scaling solution with fast confirmations' },
  { id: 'avalanche', name: 'Avalanche', color: 'bg-red-500', chainId: 43113, description: 'Subnet architecture for specialized DeFi applications' },
];

export const ChainSelector: React.FC = () => {
  const { chainId, switchChain } = useWallet();
  const [selectedChain, setSelectedChain] = useState(() => {
    const currentChain = chains.find(chain => chain.chainId === chainId) || chains[0];
    return currentChain;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChainSelect = async (chain: any) => {
    setSelectedChain(chain);
    setIsOpen(false);
    
    // Switch network if chainId is provided
    if (chain.chainId && chain.chainId !== chainId) {
      try {
        await switchChain(chain.chainId);
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  return (
    <div className="relative">
      {/* Network Info Tooltip */}
      <div className="absolute -top-2 right-0 z-50">
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
          
          {showTooltip && (
            <div className="absolute right-0 top-6 w-80 p-4 bg-slate-900 text-white rounded-lg shadow-xl text-sm z-50">
              <div className="mb-3">
                <h4 className="font-semibold text-white mb-2">🌐 Network Switching Explained</h4>
                <p className="text-slate-300 mb-3">
                  <strong>Why Switch Networks?</strong>
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li>• <strong>ZetaChain:</strong> Cross-chain hub with highest yields (15-18% APY)</li>
                  <li>• <strong>Ethereum:</strong> Most secure, established protocols (12-15% APY)</li>
                  <li>• <strong>BSC:</strong> Low fees, high speed (18-20% APY)</li>
                  <li>• <strong>Polygon:</strong> Fast confirmations, low costs (11-14% APY)</li>
                  <li>• <strong>Avalanche:</strong> Specialized DeFi (14-17% APY)</li>
                </ul>
                <p className="text-slate-300 mt-3">
                  <strong>What Happens:</strong> Your portfolio data, available pools, and AI recommendations automatically adapt to the selected network. You can lend tokens native to that specific chain.
                </p>
              </div>
              <div className="absolute -top-2 right-4 w-4 h-4 bg-slate-900 transform rotate-45"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chain Selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <div className={`w-3 h-3 rounded-full ${selectedChain.color}`} />
        <span className="font-medium text-slate-900 dark:text-slate-100">{selectedChain.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-40">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => handleChainSelect(chain)}
              className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${chain.color}`} />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{chain.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{chain.description}</div>
                </div>
              </div>
              {selectedChain.id === chain.id && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};