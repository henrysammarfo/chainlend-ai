import React from 'react';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  Globe, 
  Brain,
  CheckCircle,
  Star,
  Users,
  DollarSign,
  BarChart3,
  Play
} from 'lucide-react';
import { getCoinLogo } from '../utils/coinLogos';

interface LandingPageProps {
  setActiveTab: (tab: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const features = [
    {
      icon: Globe,
      title: 'Cross-Chain Lending',
      description: 'Lend and borrow across 5+ blockchains with a single transaction using ZetaChain Universal Smart Contracts.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Google Gemini AI analyzes market conditions to recommend optimal lending opportunities and risk levels.'
    },
    {
      icon: Shield,
      title: 'Smart Risk Management',
      description: 'Advanced algorithms assess collateral ratios and market volatility to protect your investments.'
    },
    {
      icon: TrendingUp,
      title: 'Dynamic APY Optimization',
      description: 'Real-time interest rate adjustments based on supply, demand, and cross-chain arbitrage opportunities.'
    }
  ];

  const stats = [
    { value: '$2.4M', label: 'Total Value Locked' },
    { value: '1,247', label: 'Active Users' },
    { value: '14.2%', label: 'Average APY' },
    { value: '5', label: 'Supported Chains' }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'DeFi Trader',
      content: 'ChainLend AI helped me discover 18% APY opportunities I never knew existed. The cross-chain feature is game-changing.',
      rating: 5
    },
    {
      name: 'Sarah Williams',
      role: 'Crypto Investor',
      content: 'The AI recommendations are incredibly accurate. I\'ve increased my yields by 23% since switching to ChainLend.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Portfolio Manager',
      content: 'Finally, a platform that makes cross-chain lending simple. The analytics dashboard is exactly what we needed.',
      rating: 5
    }
  ];

  const supportedChains = [
    { name: 'ZetaChain', color: 'bg-green-500' },
    { name: 'Ethereum', color: 'bg-blue-500' },
    { name: 'BSC', color: 'bg-yellow-500' },
    { name: 'Polygon', color: 'bg-purple-500' },
    { name: 'Avalanche', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ChainLend AI
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium">How it Works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium">Testimonials</a>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  <span>Powered by ZetaChain & Google AI</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Cross-Chain Lending
                  <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Powered by AI
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Maximize your DeFi yields with AI-powered cross-chain lending. Access liquidity across 5+ blockchains with intelligent risk assessment and dynamic APY optimization.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span>Start Lending</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center space-x-2 border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Live Opportunities</h3>
                    <div className="flex items-center space-x-2 text-green-600 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Live</span>
                    </div>
                  </div>
                  
                  {[
                    { token: 'USDC', chain: 'ZetaChain', apy: '15.2%', risk: 'Low' },
                    { token: 'ETH', chain: 'Ethereum', apy: '12.8%', risk: 'Medium' },
                    { token: 'USDT', chain: 'BSC', apy: '18.4%', risk: 'Medium' }
                  ].map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={getCoinLogo(opportunity.token)} 
                          alt={opportunity.token}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/32/6366f1/ffffff?text=${opportunity.token.slice(0, 2)}`;
                          }}
                        />
                        <div>
                          <div className="font-medium text-slate-900">{opportunity.token}</div>
                          <div className="text-sm text-slate-600">{opportunity.chain}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{opportunity.apy}</div>
                        <div className="text-xs text-slate-600">{opportunity.risk} Risk</div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setActiveTab('lending')}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                  >
                    View All Pools
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Why Choose ChainLend AI?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of DeFi with our revolutionary cross-chain lending platform powered by cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-8 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors duration-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Supported Blockchains</h2>
            <p className="text-lg text-slate-600">
              Access liquidity across multiple chains with seamless cross-chain transactions
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {supportedChains.map((chain, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-sm">
                <div className={`w-4 h-4 rounded-full ${chain.color}`} />
                <span className="font-medium text-slate-900">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started with cross-chain lending in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Wallet',
                description: 'Connect your Web3 wallet and access your multi-chain portfolio in one unified dashboard.'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our Google Gemini AI analyzes market conditions and recommends optimal lending opportunities.'
              },
              {
                step: '03',
                title: 'Start Earning',
                description: 'Lend across multiple chains with dynamic APY optimization and automated risk management.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900">What Our Users Say</h2>
            <p className="text-xl text-slate-600">
              Join thousands of satisfied users maximizing their DeFi yields
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Ready to Maximize Your DeFi Yields?
            </h2>
            <p className="text-xl text-green-100">
              Join the future of cross-chain lending with AI-powered optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-200 shadow-lg"
              >
                Launch ChainLend AI
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200">
                Read Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">ChainLend AI</h3>
              </div>
              <p className="text-slate-400">
                The future of cross-chain lending powered by AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 ChainLend AI. All rights reserved. Built for ZetaChain X Google Cloud Buildathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};