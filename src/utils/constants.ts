// ZetaChain Network Configuration
export const ZETACHAIN_TESTNET = {
  chainId: 7000,
  name: 'ZetaChain Athens Testnet',
  rpcUrl: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
  blockExplorer: 'https://athens3.explorer.zetachain.com',
  nativeCurrency: {
    name: 'ZETA',
    symbol: 'ZETA',
    decimals: 18
  }
};

export const ZETACHAIN_MAINNET = {
  chainId: 7000,
  name: 'ZetaChain Mainnet',
  rpcUrl: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
  blockExplorer: 'https://explorer.zetachain.com',
  nativeCurrency: {
    name: 'ZETA',
    symbol: 'ZETA',
    decimals: 18
  }
};

// Supported Chains
export const SUPPORTED_CHAINS = {
  ZETACHAIN: {
    id: 7000,
    name: 'ZetaChain',
    color: 'bg-green-500',
    rpc: 'https://zetachain-evm.blockpi.network/v1/rpc/public'
  },
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    color: 'bg-blue-500',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    id: 56,
    name: 'BSC',
    color: 'bg-yellow-500',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  POLYGON: {
    id: 137,
    name: 'Polygon',
    color: 'bg-purple-500',
    rpc: 'https://polygon-rpc.com'
  },
  AVALANCHE: {
    id: 43114,
    name: 'Avalanche',
    color: 'bg-red-500',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  }
};

// Contract Addresses (Mock for demo)
export const CONTRACT_ADDRESSES = {
  UNIVERSAL_LENDING: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
  GATEWAY: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
};

// API Endpoints
export const API_ENDPOINTS = {
  GEMINI_AI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  PRICE_FEED: 'https://api.coingecko.com/api/v3/simple/price',
  MARKET_DATA: 'https://api.defillama.com/v2/protocols'
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: { label: 'Low', color: 'green', threshold: 0.3 },
  MEDIUM: { label: 'Medium', color: 'yellow', threshold: 0.6 },
  HIGH: { label: 'High', color: 'red', threshold: 1.0 }
};

// AI Confidence Thresholds
export const AI_CONFIDENCE = {
  HIGH: 90,
  MEDIUM: 80,
  LOW: 70
};