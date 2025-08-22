import React from 'react';
import { TrendingUp, Shield, Brain, ExternalLink } from 'lucide-react';
import { LendingModal } from './LendingModal';
import { getCoinLogo } from '../../utils/coinLogos';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:border-slate-300">
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
            <h3 className="font-semibold text-slate-900">{token}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${chainColor}`} />
              <span className="text-sm text-slate-600">{chain}</span>
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
          <span className="text-sm font-medium text-slate-600">Current APY</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{apy}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-600 mb-1">Total Value Locked</p>
          <p className="font-semibold text-slate-900">{tvl}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Available to Lend</p>
          <p className="font-semibold text-slate-900">{available}</p>
        </div>
      </div>

      {/* AI Score */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-slate-600">AI Score</span>
        </div>
        <div className={`font-bold ${getAIScoreColor(aiScore)}`}>
          {aiScore}/100
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
        >
          Lend Now
        </button>
        <button className="p-3 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* AI Recommendation */}
      {aiScore > 90 && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">AI Recommended</span>
          </div>
          <p className="text-xs text-purple-700 mt-1">
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