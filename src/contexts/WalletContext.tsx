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
  chainId: number | null;
  balance: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
  switchChain: (chainId: number) => Promise<void>;
  testnetBalances: {
    USDC: string;
    ETH: string;
    USDT: string;
    DAI: string;
    AVAX: string;
    BNB: string;
  };
  currentNetworkData: {
    name: string;
    rpc: string;
    explorer: string;
    nativeCurrency: string;
    blockTime: number;
  };
}

const NETWORKS = {
  7001: {
    name: 'ZetaChain Testnet',
    rpc: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
    explorer: 'https://explorer.zetachain.com/',
    nativeCurrency: 'ZETA',
    blockTime: 2
  },
  11155111: {
    name: 'Ethereum Sepolia',
    rpc: 'https://sepolia.infura.io/v3/',
    explorer: 'https://sepolia.etherscan.io/',
    nativeCurrency: 'ETH',
    blockTime: 12
  },
  97: {
    name: 'BSC Testnet',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorer: 'https://testnet.bscscan.com/',
    nativeCurrency: 'tBNB',
    blockTime: 3
  },
  80001: {
    name: 'Polygon Mumbai',
    rpc: 'https://rpc-mumbai.maticvigil.com/',
    explorer: 'https://mumbai.polygonscan.com/',
    nativeCurrency: 'MATIC',
    blockTime: 2
  },
  43113: {
    name: 'Avalanche Fuji',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorer: 'https://testnet.snowtrace.io/',
    nativeCurrency: 'AVAX',
    blockTime: 2
  }
};

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
  const [chainId, setChainId] = useState<number | null>(7001); // Default to ZetaChain
  const [balance, setBalance] = useState('0');

  // Mock testnet balances that adapt to network
  const getTestnetBalances = (chainId: number) => {
    const baseBalances = {
      USDC: '5000.00',
      ETH: '2.5',
      USDT: '2000.00',
      DAI: '1500.00',
      AVAX: '100.00',
      BNB: '5.00'
    };

    // Adjust balances based on network
    switch (chainId) {
      case 7001: // ZetaChain
        return {
          ...baseBalances,
          USDC: '10000.00',
          ETH: '5.0',
          USDT: '5000.00'
        };
      case 11155111: // Ethereum Sepolia
        return {
          ...baseBalances,
          ETH: '10.0',
          USDC: '8000.00'
        };
      case 97: // BSC Testnet
        return {
          ...baseBalances,
          BNB: '20.00',
          USDT: '8000.00'
        };
      case 80001: // Polygon Mumbai
        return {
          ...baseBalances,
          DAI: '3000.00',
          MATIC: '1000.00'
        };
      case 43113: // Avalanche Fuji
        return {
          ...baseBalances,
          AVAX: '200.00',
          USDC: '6000.00'
        };
      default:
        return baseBalances;
    }
  };

  const [testnetBalances, setTestnetBalances] = useState(getTestnetBalances(7001));

  // Update balances when network changes
  useEffect(() => {
    if (chainId) {
      setTestnetBalances(getTestnetBalances(chainId));
    }
  }, [chainId]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAddress(account);
        setIsConnected(true);
        
        // Get current chain ID
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdNumber = parseInt(currentChainId, 16);
        setChainId(chainIdNumber);
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest']
        });
        setBalance((parseInt(balance, 16) / 1e18).toFixed(4));
        
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
          const newChainId = parseInt(chainId, 16);
          setChainId(newChainId);
          window.location.reload();
        });
        
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this app!');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    setBalance('0');
  };

  const switchChain = async (newChainId: number) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${newChainId.toString(16)}` }],
        });
        setChainId(newChainId);
      } catch (error: any) {
        if (error.code === 4902) {
          // Chain not added, add it
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${newChainId.toString(16)}`,
                chainName: NETWORKS[newChainId as keyof typeof NETWORKS]?.name || 'Unknown Network',
                nativeCurrency: {
                  name: NETWORKS[newChainId as keyof typeof NETWORKS]?.nativeCurrency || 'ETH',
                  symbol: NETWORKS[newChainId as keyof typeof NETWORKS]?.nativeCurrency || 'ETH',
                  decimals: 18
                },
                rpcUrls: [NETWORKS[newChainId as keyof typeof NETWORKS]?.rpc || ''],
                blockExplorerUrls: [NETWORKS[newChainId as keyof typeof NETWORKS]?.explorer || '']
              }]
            });
            setChainId(newChainId);
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        } else {
          console.error('Failed to switch network:', error);
        }
      }
    }
  };

  const currentNetworkData = chainId ? NETWORKS[chainId as keyof typeof NETWORKS] || NETWORKS[7001] : NETWORKS[7001];

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      chainId,
      balance,
      connectWallet,
      disconnectWallet,
      switchChain,
      testnetBalances,
      currentNetworkData
    }}>
      {children}
    </WalletContext.Provider>
  );
};