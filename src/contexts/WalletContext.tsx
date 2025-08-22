import React, { createContext, useContext, useState, useEffect } from 'react';

// Declare ethereum object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string;
  chainId: number;
  testnetBalances: { [token: string]: string };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchChain: (chainId: number) => Promise<void>;
  addTestnetTokens: (tokenAddress: string) => Promise<void>;
  updateBalance: (token: string, amount: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0.00');
  const [chainId, setChainId] = useState(7001); // Default to ZetaChain testnet
  const [testnetBalances, setTestnetBalances] = useState<{ [token: string]: string }>({
    USDC: '5000.00',
    ETH: '2.5',
    USDT: '3000.00',
    DAI: '1500.00',
    ZETA: '1000.00',
    BNB: '10.0',
    MATIC: '2000.00',
    AVAX: '50.0'
  });

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainId, 16));
          // Get balance (simplified)
          setBalance('12.847');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  // Real wallet connection with MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          
          // Get current chain ID
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainId, 16));
          
          // Set testnet balance
          setBalance('25.847');
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnectWallet();
            } else {
              setAddress(accounts[0]);
            }
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId: string) => {
            setChainId(parseInt(chainId, 16));
          });
        }
      } else {
        // Fallback to simulation if MetaMask not available
        setIsConnected(true);
        setAddress('0x742d35Cc6634C0532925a3b8D4C9db96590c6C87');
        setBalance('25.847');
        setChainId(7001); // ZetaChain testnet
        alert('MetaMask not detected. Using simulated wallet for demo.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0.00');
    setChainId(7001);
  };

  const updateBalance = (token: string, amount: string) => {
    setTestnetBalances(prev => ({
      ...prev,
      [token]: amount
    }));
  };

  const switchChain = async (newChainId: number) => {
    try {
      if (typeof window.ethereum !== 'undefined' && isConnected) {
        const chainIdHex = '0x' + newChainId.toString(16);
        
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
          });
          setChainId(newChainId);
        } catch (switchError: any) {
          // Chain not added to MetaMask
          if (switchError.code === 4902) {
            await addNetwork(newChainId);
          } else {
            throw switchError;
          }
        }
      } else {
        // Fallback simulation
        setChainId(newChainId);
      }
    } catch (error) {
      console.error('Failed to switch chain:', error);
      alert('Failed to switch network. Please try manually in your wallet.');
    }
  };

  const addNetwork = async (chainId: number) => {
    const networks: { [key: number]: any } = {
      7001: {
        chainId: '0x1B59',
        chainName: 'ZetaChain Athens Testnet',
        nativeCurrency: { name: 'ZETA', symbol: 'ZETA', decimals: 18 },
        rpcUrls: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'],
        blockExplorerUrls: ['https://athens3.explorer.zetachain.com/']
      },
      11155111: {
        chainId: '0xAA36A7',
        chainName: 'Ethereum Sepolia',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io/']
      }
    };

    const network = networks[chainId];
    if (network && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
        setChainId(chainId);
      } catch (error) {
        console.error('Failed to add network:', error);
      }
    }
  };

  const addTestnetTokens = async (tokenAddress: string) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: 'USDC',
              decimals: 6,
              image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to add token:', error);
    }
  };

  const value = {
    isConnected,
    address,
    balance,
    chainId,
    testnetBalances,
    connectWallet,
    disconnectWallet,
    switchChain,
    addTestnetTokens,
    updateBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};