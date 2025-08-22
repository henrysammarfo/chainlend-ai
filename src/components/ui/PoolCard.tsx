import React, { useState } from 'react';
import { TrendingUp, Shield, Brain, ExternalLink, Wallet, CheckCircle } from 'lucide-react';
import { LendingModal } from './LendingModal';
import { getCoinLogo } from '../../utils/coinLogos';
import { useWallet } from '../../contexts/WalletContext';

interface PoolCardProps {
  token: string;
  chain: string;
  apy: string;
  tvl: string;
  available: string;
  risk: string;
  aiScore: number;
  chainColor: string;
}

export const PoolCard: React.FC<PoolCardProps> = ({
  token,
  chain,
  apy,
  tvl,
  available,
  risk,
  aiScore,
  chainColor,
}) => {
  const { isConnected, testnetBalances, chainId, currentNetworkData } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLending, setIsLending] = useState(false);
  const [lendingAmount, setLendingAmount] = useState('');
  const [lendingSuccess, setLendingSuccess] = useState(false);

  // Get user's balance for this token
  const getUserBalance = () => {
    if (!isConnected) return '0';
    
    const tokenKey = token as keyof typeof testnetBalances;
    return testnetBalances[tokenKey] || '0';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
      case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleLend = async () => {
    if (!isConnected) {
      setIsModalOpen(true);
      return;
    }

    if (!lendingAmount || parseFloat(lendingAmount) <= 0) {
      alert('Please enter a valid amount to lend');
      return;
    }

    const userBalance = parseFloat(getUserBalance());
    const amount = parseFloat(lendingAmount);

    if (amount > userBalance) {
      alert(`Insufficient balance. You have ${userBalance} ${token}`);
      return;
    }

    setIsLending(true);
    
    try {
      // Simulate lending transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLendingSuccess(true);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span>✅ Successfully lent ${lendingAmount} ${token} on ${currentNetworkData.name}!</span>
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

      // Reset form
      setLendingAmount('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setLendingSuccess(false), 3000);
      
    } catch (error) {
      console.error('Lending failed:', error);
      alert('Lending failed. Please try again.');
    } finally {
      setIsLending(false);
    }
  };

  const handleMaxAmount = () => {
    const balance = getUserBalance();
    setLendingAmount(balance);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={getCoinLogo(token)} 
            alt={token}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/40/6366f1/ffffff?text=${token.slice(0, 2)}`;
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{token}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${chainColor}`} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{chain}</span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(risk)}`}>
          {risk} Risk
        </div>
      </div>

      {/* APY */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Current APY</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{apy}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Value Locked</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{tvl}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Available to Lend</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{available}</p>
        </div>
      </div>

      {/* AI Score */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Score</span>
        </div>
        <div className={`font-bold ${getAIScoreColor(aiScore)}`}>
          {aiScore}/100
        </div>
      </div>

      {/* Lending Input */}
      {isConnected && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount to Lend</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Balance: {getUserBalance()} {token}
            </span>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              value={lendingAmount}
              onChange={(e) => setLendingAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
            <button
              onClick={handleMaxAmount}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button 
          onClick={handleLend}
          disabled={isLending || lendingSuccess}
          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {lendingSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Lent Successfully!</span>
            </>
          ) : isLending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Lending...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>{isConnected ? 'Lend Now' : 'Connect to Lend'}</span>
            </>
          )}
        </button>
        <button className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* AI Recommendation */}
      {aiScore > 90 && (
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">AI Recommended</span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            High confidence opportunity with optimal risk-reward ratio
          </p>
        </div>
      )}

      <LendingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pool={{ token, chain, apy, available, risk, chainColor }}
      />
    </div>
  );
};