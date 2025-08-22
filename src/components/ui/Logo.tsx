import React from 'react';
import { Shield, Link, Brain, Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        
        {/* Main icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Shield className="w-full h-full text-white p-1.5" />
        </div>
        
        {/* AI indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Brain className="w-2 h-2 text-white" />
        </div>
        
        {/* Chain indicator */}
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
          <Link className="w-1.5 h-1.5 text-white" />
        </div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${textSizes[size]} tracking-tight`}>
            ChainLend AI
          </h1>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-indigo-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Cross-Chain DeFi</span>
          </div>
        </div>
      )}
    </div>
  );
};
