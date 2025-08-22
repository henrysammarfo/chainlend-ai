import React, { useState } from 'react';
import { X, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { getCoinLogo } from '../../utils/coinLogos';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: {
    token: string;
    chain: string;
    amount: string;
    value: string;
    earned: string;
    chainColor: string;
  };
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, position }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isConnected, connectWallet, updateBalance, testnetBalances } = useWallet();

  if (!isOpen) return null;

  const handleWithdraw = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsLoading(true);
    // Simulate transaction
    setTimeout(() => {
      // Update balance after withdrawal
      const currentBalance = parseFloat(testnetBalances[position.token] || '0');
      const withdrawAmt = parseFloat(withdrawAmount);
      const newBalance = (currentBalance + withdrawAmt).toString();
      updateBalance(position.token, newBalance);
      
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setWithdrawAmount('');
      }, 2000);
    }, 3000);
  };

  const maxAmount = parseFloat(position.amount.replace(/,/g, ''));
  const withdrawValue = withdrawAmount ? (parseFloat(withdrawAmount) * parseFloat(position.value.replace(/[$,]/g, '')) / maxAmount).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Withdraw {position.token}</h2>
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
            <h3 className="text-lg font-semibold text-slate-900">Withdrawal Successful!</h3>
            <p className="text-slate-600">Your {position.token} has been withdrawn from {position.chain}</p>
          </div>
        ) : (
          <>
            {/* Position Info */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={getCoinLogo(position.token)} 
                  alt={position.token}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/32/6366f1/ffffff?text=${position.token.slice(0, 2)}`;
                  }}
                />
                <div>
                  <h3 className="font-semibold text-slate-900">{position.token}</h3>
                  <p className="text-sm text-slate-600">{position.chain}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Position</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${position.chainColor}`} />
                  <span className="font-medium">{position.token} on {position.chain}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Amount</span>
                <span className="font-semibold">{position.amount} {position.token}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Earned</span>
                <span className="font-semibold text-green-600">${position.earned}</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount to Withdraw</label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  max={maxAmount}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium">
                  {position.token}
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Available: {position.amount} {position.token}</span>
                <button 
                  onClick={() => setWithdrawAmount(maxAmount.toString())}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Withdrawal Summary */}
            {withdrawAmount && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">You will receive</span>
                    <span className="text-blue-800 font-bold">{withdrawAmount} {position.token}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Estimated value</span>
                    <span className="text-blue-800 font-bold">${withdrawValue}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-700">
                <p className="font-medium mb-1">Withdrawal Notice</p>
                <p>Withdrawing will stop earning interest on the withdrawn amount. Consider partial withdrawal to maintain earnings.</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || isLoading || parseFloat(withdrawAmount) > maxAmount}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isConnected ? 'Confirm Withdrawal' : 'Connect Wallet'}</span>
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