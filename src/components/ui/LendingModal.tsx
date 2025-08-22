import React, { useState } from 'react';
import { X, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { getCoinLogo } from '../../utils/coinLogos';

interface LendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: {
    token: string;
    chain: string;
    apy: string;
    available: string;
    risk: string;
    chainColor: string;
  };
}

export const LendingModal: React.FC<LendingModalProps> = ({ isOpen, onClose, pool }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isConnected, connectWallet, updateBalance, testnetBalances } = useWallet();

  if (!isOpen) return null;

  const handleLend = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsLoading(true);
    // Simulate transaction
    setTimeout(() => {
      // Update balance after lending
      const currentBalance = parseFloat(testnetBalances[pool.token] || '0');
      const lendAmount = parseFloat(amount);
      const newBalance = Math.max(0, currentBalance - lendAmount).toString();
      updateBalance(pool.token, newBalance);
      
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setAmount('');
      }, 2000);
    }, 3000);
  };

  const estimatedEarnings = amount ? (parseFloat(amount) * parseFloat(pool.apy) / 100).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Lend {pool.token}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Transaction Successful!</h3>
            <p className="text-slate-600">Your {pool.token} has been successfully lent on {pool.chain}</p>
          </div>
        ) : (
          <>
            {/* Pool Info */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={getCoinLogo(pool.token)} 
                  alt={pool.token}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/32/6366f1/ffffff?text=${pool.token.slice(0, 2)}`;
                  }}
                />
                <div>
                  <h3 className="font-semibold text-slate-900">{pool.token}</h3>
                  <p className="text-sm text-slate-600">{pool.chain}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Pool</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${pool.chainColor}`} />
                  <span className="font-medium">{pool.token} on {pool.chain}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Current APY</span>
                <span className="font-semibold text-green-600">{pool.apy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Risk Level</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pool.risk === 'Low' ? 'bg-green-100 text-green-700' :
                  pool.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {pool.risk}
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount to Lend</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium">
                  {pool.token}
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Available: {pool.available}</span>
                <button 
                  onClick={() => setAmount(pool.available.replace(/[^0-9.]/g, ''))}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Earnings Estimate */}
            {amount && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-medium">Estimated Annual Earnings</span>
                  <span className="text-green-800 font-bold">${estimatedEarnings} {pool.token}</span>
                </div>
              </div>
            )}

            {/* Risk Warning */}
            <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-700">
                <p className="font-medium mb-1">Risk Disclosure</p>
                <p>Lending involves smart contract risks and potential impermanent loss. Only lend what you can afford to lose.</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleLend}
              disabled={!amount || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isConnected ? 'Confirm Lending' : 'Connect Wallet'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};