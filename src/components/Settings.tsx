import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Wallet, 
  Globe, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  ChevronRight,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';

export const Settings: React.FC = () => {
  const { isConnected, chainId, switchChain } = useWallet();
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    lending: true,
    portfolio: true,
    ai: false,
    security: true
  });
  const [slippage, setSlippage] = useState('0.5');
  const [gasPrice, setGasPrice] = useState('standard');

  const networks = [
    { id: 7001, name: 'ZetaChain Testnet', rpc: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public', color: 'bg-green-500' },
    { id: 11155111, name: 'Ethereum Sepolia', rpc: 'https://sepolia.infura.io/v3/', color: 'bg-blue-500' },
    { id: 97, name: 'BSC Testnet', rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/', color: 'bg-yellow-500' },
    { id: 80001, name: 'Polygon Mumbai', rpc: 'https://rpc-mumbai.maticvigil.com/', color: 'bg-purple-500' },
    { id: 43113, name: 'Avalanche Fuji', rpc: 'https://api.avax-test.network/ext/bc/C/rpc', color: 'bg-red-500' }
  ];

  const handleNetworkSwitch = async (networkId: number) => {
    if (isConnected) {
      await switchChain(networkId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your ChainLend AI preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Network Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Network Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Active Network</label>
                <div className="space-y-2">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleNetworkSwitch(network.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        chainId === network.id 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${network.color}`} />
                        <span className="font-medium text-slate-900">{network.name}</span>
                      </div>
                      {chainId === network.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Auto-Switch Networks</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Automatically switch to optimal network for transactions</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              {isDarkMode ? <Moon className="w-5 h-5 mr-2 text-blue-500" /> : <Sun className="w-5 h-5 mr-2 text-yellow-500" />}
              Appearance
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Dark Mode</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark themes</p>
              </div>
              <button onClick={toggleTheme} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-slate-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Transaction Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2 text-purple-500" />
              Transaction Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Slippage Tolerance</label>
                <div className="flex space-x-2">
                  {['0.1', '0.5', '1.0', '2.0'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        slippage === value
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <input
                    type="text"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="Custom"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Gas Price</label>
                <div className="space-y-2">
                  {[
                    { id: 'slow', label: 'Slow', desc: 'Lower fees, longer confirmation' },
                    { id: 'standard', label: 'Standard', desc: 'Balanced fees and speed' },
                    { id: 'fast', label: 'Fast', desc: 'Higher fees, faster confirmation' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setGasPrice(option.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        gasPrice === option.id 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-slate-900">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.desc}</div>
                      </div>
                      {gasPrice === option.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'lending', label: 'Lending Opportunities', desc: 'New high-yield pools and rate changes' },
                { key: 'portfolio', label: 'Portfolio Updates', desc: 'Position changes and earnings' },
                { key: 'ai', label: 'AI Recommendations', desc: 'Smart insights and optimization tips' },
                { key: 'security', label: 'Security Alerts', desc: 'Important security notifications' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{item.label}</h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-green-500" />
              Wallet Info
            </h3>
            
            {isConnected ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-700 font-medium">Connected</div>
                  <div className="text-xs text-green-600">Testnet Mode Active</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Network</div>
                  <div className="font-medium text-slate-900">
                    {networks.find(n => n.id === chainId)?.name || 'Unknown Network'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm text-orange-700 font-medium">Not Connected</div>
                <div className="text-xs text-orange-600">Connect wallet to access features</div>
              </div>
            )}
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Security
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <span className="text-slate-900">Transaction Signing</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <span className="text-slate-900">Privacy Settings</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <span className="text-slate-900">Export Data</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Testnet Info */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-5 h-5" />
              <h3 className="font-semibold">Testnet Mode</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              You're using testnet tokens. No real funds are at risk.
            </p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              Get Testnet Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};