import React from 'react';
import { useBitcoinWallet } from '@zetachain/universalkit';
import { ConnectBitcoin } from '@zetachain/universalkit';
import { Wallet, Globe, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export const ZetaChainStatus: React.FC = () => {
  const { address: btcAddress, loading, connectedWalletType, connectWallet, disconnect } = useBitcoinWallet();

  const getStatusColor = () => {
    if (btcAddress) return 'text-green-600';
    if (loading) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (btcAddress) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (loading) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusText = () => {
    if (btcAddress) return 'Connected to ZetaChain';
    if (loading) return 'Connecting...';
    return 'Not connected to ZetaChain';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-green-500" />
          ZetaChain Status
        </h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Bitcoin Wallet Connection */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-900 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-orange-500" />
              Bitcoin Wallet
            </h4>
            {btcAddress && (
              <button
                onClick={disconnect}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Disconnect
              </button>
            )}
          </div>
          
          {btcAddress ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Address:</span>
                <span className="text-sm font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded">
                  {btcAddress.slice(0, 8)}...{btcAddress.slice(-6)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Type:</span>
                <span className="text-sm font-medium text-slate-900">
                  {connectedWalletType || 'Unknown'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Connect your Bitcoin wallet to enable cross-chain functionality
              </p>
              <ConnectBitcoin />
            </div>
          )}
        </div>

        {/* ZetaChain Features */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 flex items-center mb-3">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            Available Features
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700">Cross-Chain Calls</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700">Universal Contracts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700">Bitcoin Integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-700">Multi-Chain Support</span>
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">Network Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Network:</span>
              <span className="font-medium text-slate-900">ZetaChain Athens Testnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Chain ID:</span>
              <span className="font-medium text-slate-900">7001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
