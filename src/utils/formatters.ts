// Utility functions for formatting data

export const formatCurrency = (amount: number | string, currency = 'USD'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatPercentage = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0%';
  
  return `${num.toFixed(2)}%`;
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatNumber = (num: number | string): string => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(value)) return '0';
  
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  
  return value.toLocaleString();
};

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const calculateAPY = (principal: number, rate: number, time: number): number => {
  // Compound interest formula: A = P(1 + r/n)^(nt)
  // For simplicity, assuming daily compounding (n = 365)
  const n = 365;
  const amount = principal * Math.pow(1 + rate / n, n * time);
  return ((amount - principal) / principal) * 100;
};

export const formatTokenAmount = (amount: string | number, decimals = 18): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(value)) return '0';
  
  // Convert from wei to token amount
  const tokenAmount = value / Math.pow(10, decimals);
  
  if (tokenAmount < 0.001) {
    return tokenAmount.toExponential(2);
  }
  
  return tokenAmount.toFixed(6).replace(/\.?0+$/, '');
};