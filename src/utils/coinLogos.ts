// Coin logos from reliable CDN sources
export const COIN_LOGOS = {
  // Major cryptocurrencies
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  DAI: 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
  ZETA: 'https://assets.coingecko.com/coins/images/31883/large/zeta.png',
  
  // Additional tokens
  LINK: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  UNI: 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg',
  AAVE: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
  COMP: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png',
  SUSHI: 'https://assets.coingecko.com/coins/images/12271/large/512x512_Logo_no_chop.png',
  
  // Stablecoins
  BUSD: 'https://assets.coingecko.com/coins/images/9576/large/BUSD.png',
  FRAX: 'https://assets.coingecko.com/coins/images/13422/large/FRAX_icon.png',
  TUSD: 'https://assets.coingecko.com/coins/images/3449/large/tusd.png',
};

// Chain logos
export const CHAIN_LOGOS = {
  ethereum: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  bsc: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  polygon: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
  avalanche: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
  zetachain: 'https://assets.coingecko.com/coins/images/31883/large/zeta.png',
};

// Fallback function for missing logos
export const getCoinLogo = (symbol: string | undefined | null): string => {
  // Handle undefined, null, or empty symbol
  if (!symbol || typeof symbol !== 'string') {
    return 'https://via.placeholder.com/32/6366f1/ffffff?text=?';
  }
  
  const upperSymbol = symbol.toUpperCase();
  return COIN_LOGOS[upperSymbol as keyof typeof COIN_LOGOS] || 
         `https://via.placeholder.com/32/6366f1/ffffff?text=${symbol.slice(0, 2)}`;
};

export const getChainLogo = (chain: string | undefined | null): string => {
  // Handle undefined, null, or empty chain
  if (!chain || typeof chain !== 'string') {
    return 'https://via.placeholder.com/24/6366f1/ffffff?text=?';
  }
  
  const lowerChain = chain.toLowerCase();
  return CHAIN_LOGOS[lowerChain as keyof typeof CHAIN_LOGOS] || 
         `https://via.placeholder.com/24/6366f1/ffffff?text=${chain.slice(0, 1)}`;
};