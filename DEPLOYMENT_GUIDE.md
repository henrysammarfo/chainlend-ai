# 🚀 ChainLend AI - Complete Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ ZetaChain CLI installed
- ✅ MetaMask wallet with testnet ZETA
- ✅ Node.js 18+ installed
- ✅ Git installed

## 🛠️ Step 1: Environment Setup

1. **Clone/Copy the project files to your local machine**

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Add your private key to `.env`:**
```env
PRIVATE_KEY=your_private_key_here
ZETACHAIN_RPC_URL=https://zetachain-athens-evm.blockpi.network/v1/rpc/public
VITE_ZETACHAIN_RPC_URL=https://zetachain-athens-evm.blockpi.network/v1/rpc/public
```

## 🔧 Step 2: Smart Contract Deployment

### Compile Contracts
```bash
npm run compile
```

### Deploy to ZetaChain Testnet
```bash
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Deploying ChainLend AI to ZetaChain Testnet...
📝 Deploying with account: 0x...
💰 Account balance: 25.847 ZETA
✅ ChainLend AI deployed to: 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87
🔗 System Contract: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
🌐 Network: ZetaChain Athens Testnet
🔍 Explorer: https://athens3.explorer.zetachain.com/address/0x742d35Cc6634C0532925a3b8D4C9db96590c6C87
```

### Test Contracts
```bash
npm run test:contracts
```

## 🌐 Step 3: Frontend Configuration

1. **Update contract address in `.env`:**
```env
VITE_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b8D4C9db96590c6C87
```

2. **Start development server:**
```bash
npm run dev
```

## 🔗 Step 4: MetaMask Setup

### Add ZetaChain Testnet to MetaMask:
- **Network Name:** ZetaChain Athens Testnet
- **RPC URL:** https://zetachain-athens-evm.blockpi.network/v1/rpc/public
- **Chain ID:** 7001
- **Currency Symbol:** ZETA
- **Block Explorer:** https://athens3.explorer.zetachain.com

### Get Testnet Tokens:
1. Visit: https://www.zetachain.com/docs/developers/testnet/
2. Request testnet ZETA tokens
3. Add testnet tokens to your wallet

## 🎯 Step 5: Testing the Platform

### Test Wallet Connection:
1. ✅ Connect MetaMask wallet
2. ✅ Switch to ZetaChain testnet
3. ✅ Verify balance shows in portfolio

### Test Lending Features:
1. ✅ Navigate to "Lending Pools"
2. ✅ Select a pool (e.g., USDC on ZetaChain)
3. ✅ Click "Lend Now"
4. ✅ Enter amount and confirm transaction
5. ✅ Verify balance updates in portfolio

### Test Portfolio:
1. ✅ Check portfolio shows your positions
2. ✅ Test withdraw functionality
3. ✅ Verify balance updates correctly

### Test Settings:
1. ✅ Toggle dark/light mode
2. ✅ Switch between networks
3. ✅ Adjust transaction settings

## 🚀 Step 6: Mainnet Deployment (When Ready)

### Deploy to ZetaChain Mainnet:
```bash
npm run deploy:mainnet
```

### Update environment for production:
```env
VITE_ZETACHAIN_RPC_URL=https://zetachain-evm.blockpi.network/v1/rpc/public
VITE_CONTRACT_ADDRESS=your_mainnet_contract_address
```

## 📊 Step 7: Verification

### Verify Contract on Explorer:
```bash
npx hardhat verify --network zetachain-testnet 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87 "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
```

### Test All Features:
- ✅ Landing page loads correctly
- ✅ Wallet connection works
- ✅ All navigation works
- ✅ Lending/borrowing functions
- ✅ Portfolio updates in real-time
- ✅ Settings page functional
- ✅ Dark mode toggle works
- ✅ Cross-chain network switching

## 🎬 Step 8: Demo Preparation

### For Hackathon Demo:
1. **Record demo video** showing:
   - Landing page overview
   - Wallet connection
   - Lending transaction
   - Portfolio management
   - AI insights
   - Cross-chain features

2. **Prepare presentation** covering:
   - Problem statement
   - Solution overview
   - Technical architecture
   - ZetaChain integration
   - AI features
   - Market impact

## 🏆 Step 9: Hackathon Submission

### Required Deliverables:
- ✅ GitHub repository with complete source code
- ✅ README.md with setup instructions
- ✅ 3-5 minute demo video
- ✅ Presentation deck
- ✅ Working prototype on testnet
- ✅ Universal Contract deployed on mainnet

### Submission Checklist:
- ✅ All code is original and created during hackathon
- ✅ ZetaChain Universal Smart Contracts implemented
- ✅ Cross-chain functionality demonstrated
- ✅ AI integration clearly shown
- ✅ Professional UI/UX
- ✅ Comprehensive documentation

## 🆘 Troubleshooting

### Common Issues:

**1. Contract deployment fails:**
- Check you have enough testnet ZETA
- Verify private key is correct
- Ensure RPC URL is accessible

**2. Wallet connection issues:**
- Clear browser cache
- Reset MetaMask
- Check network configuration

**3. Transaction failures:**
- Increase gas limit
- Check token balances
- Verify contract address

**4. Frontend errors:**
- Check console for errors
- Verify environment variables
- Restart development server

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure you're on the correct network
4. Check ZetaChain Discord for support

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ Smart contract deployed and verified
- ✅ Frontend loads without errors
- ✅ Wallet connects successfully
- ✅ All buttons and features work
- ✅ Transactions process correctly
- ✅ Portfolio updates in real-time
- ✅ Cross-chain switching works
- ✅ Dark mode toggle functions

**You're now ready to win the ZetaChain X Google Cloud Buildathon! 🏆**