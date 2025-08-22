import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

const chains = [
  { id: 'all', name: 'All Chains', color: 'bg-slate-500', chainId: null },
  { id: 'zetachain', name: 'ZetaChain', color: 'bg-green-500', chainId: 7001 },
  { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500', chainId: 11155111 },
  { id: 'bsc', name: 'BSC', color: 'bg-yellow-500', chainId: 97 },
  { id: 'polygon', name: 'Polygon', color: 'bg-purple-500', chainId: 80001 },
  { id: 'avalanche', name: 'Avalanche', color: 'bg-red-500', chainId: 43113 },
];

export const ChainSelector: React.FC = () => {
  const { chainId, switchChain } = useWallet();
  const [selectedChain, setSelectedChain] = useState(() => {
    const currentChain = chains.find(chain => chain.chainId === chainId) || chains[0];
    return currentChain;
  });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className={`w-3 h-3 rounded-full ${selectedChain.color}`} />
        <span className="font-medium text-slate-900">{selectedChain.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[180px]">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={async () => {
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
              }}
              className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${chain.color}`} />
                <span className="text-slate-900">{chain.name}</span>
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