const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainLend AI to ZetaChain Testnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ZETA");
  
  // ZetaChain System Contract address (testnet)
  const SYSTEM_CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  // Deploy the contract
  console.log("📦 Deploying ChainLend AI Universal Smart Contract...");
  const ChainLendAI = await ethers.getContractFactory("ChainLendAI");
  const chainLendAI = await ChainLendAI.deploy(SYSTEM_CONTRACT_ADDRESS);
  
  await chainLendAI.deployed();
  
  console.log("✅ ChainLend AI deployed to:", chainLendAI.address);
  console.log("🔗 System Contract:", SYSTEM_CONTRACT_ADDRESS);
  console.log("🌐 Network: ZetaChain Athens Testnet");
  console.log("🔍 Explorer:", `https://athens3.explorer.zetachain.com/address/${chainLendAI.address}`);
  
  // Create initial testnet lending pools
  console.log("\n🏊 Creating testnet lending pools...");
  
  const testnetPools = [
    {
      chainId: 7001, // ZetaChain Testnet
      token: "0x05BA149A7bd6dC1F937fA9046A9e05C05f3b18b0", // Mock USDC
      baseAPY: 1520, // 15.20%
      name: "USDC"
    },
    {
      chainId: 11155111, // Ethereum Sepolia
      token: "0xA0b86a33E6441b8435b662303c0f479c7e1d5b1e", // Mock ETH
      baseAPY: 1280, // 12.80%
      name: "ETH"
    },
    {
      chainId: 97, // BSC Testnet
      token: "0x55d398326f99059fF775485246999027B3197955", // Mock USDT
      baseAPY: 1840, // 18.40%
      name: "USDT"
    },
    {
      chainId: 80001, // Polygon Mumbai
      token: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Mock DAI
      baseAPY: 1160, // 11.60%
      name: "DAI"
    }
  ];
  
  for (const pool of testnetPools) {
    try {
      console.log(`📝 Creating ${pool.name} pool on chain ${pool.chainId}...`);
      const tx = await chainLendAI.createLendingPool(
        pool.chainId,
        pool.token,
        pool.baseAPY
      );
      await tx.wait();
      console.log(`✅ Created ${pool.name} pool: APY ${pool.baseAPY / 100}%`);
    } catch (error) {
      console.error(`❌ Failed to create ${pool.name} pool:`, error.message);
    }
  }
  
  // Add AI recommendations for testnet
  console.log("\n🧠 Adding AI recommendations for testnet...");
  
  const testnetRecommendations = [
    {
      chainId: 7001,
      token: "0x05BA149A7bd6dC1F937fA9046A9e05C05f3b18b0",
      recommendedAPY: 1520,
      riskScore: 25, // Low risk
      confidence: 95,
      reason: "Testnet: High liquidity and stable collateral ratios"
    },
    {
      chainId: 97,
      token: "0x55d398326f99059fF775485246999027B3197955",
      recommendedAPY: 1840,
      riskScore: 45, // Medium risk
      confidence: 88,
      reason: "Testnet: High yield opportunity with moderate volatility"
    },
    {
      chainId: 11155111,
      token: "0xA0b86a33E6441b8435b662303c0f479c7e1d5b1e",
      recommendedAPY: 1280,
      riskScore: 35, // Low-medium risk
      confidence: 92,
      reason: "Testnet: Ethereum ecosystem stability with good returns"
    }
  ];
  
  for (const rec of testnetRecommendations) {
    try {
      console.log(`🤖 Adding AI recommendation for chain ${rec.chainId}...`);
      const tx = await chainLendAI.addAIRecommendation(
        rec.chainId,
        rec.token,
        rec.recommendedAPY,
        rec.riskScore,
        rec.confidence,
        rec.reason
      );
      await tx.wait();
      console.log(`✅ Added AI recommendation: Confidence ${rec.confidence}%`);
    } catch (error) {
      console.error(`❌ Failed to add AI recommendation:`, error.message);
    }
  }
  
  console.log("\n🎉 Testnet deployment completed successfully!");
  console.log("📋 Testnet Contract Summary:");
  console.log("   - Contract Address:", chainLendAI.address);
  console.log("   - Network: ZetaChain Athens Testnet (Chain ID: 7001)");
  console.log("   - Explorer:", `https://athens3.explorer.zetachain.com/address/${chainLendAI.address}`);
  console.log("   - Initial Pools:", testnetPools.length);
  console.log("   - AI Recommendations:", testnetRecommendations.length);
  
  // Save deployment info
  const deploymentInfo = {
    network: "zetachain-testnet",
    chainId: 7001,
    contractAddress: chainLendAI.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    explorer: `https://athens3.explorer.zetachain.com/address/${chainLendAI.address}`,
    pools: testnetPools.length,
    recommendations: testnetRecommendations.length
  };
  
  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Instructions for frontend
  console.log("\n📱 Frontend Integration:");
  console.log("1. Update .env file with:");
  console.log(`   VITE_CONTRACT_ADDRESS=${chainLendAI.address}`);
  console.log(`   VITE_ZETACHAIN_RPC_URL=https://zetachain-athens-evm.blockpi.network/v1/rpc/public`);
  console.log("2. Connect MetaMask to ZetaChain Testnet");
  console.log("3. Get testnet ZETA from: https://www.zetachain.com/docs/developers/testnet/");
  
  return chainLendAI.address;
}

main()
  .then((address) => {
    console.log("\n✨ Testnet deployment script completed successfully!");
    console.log("🚀 Ready for demo and testing!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Testnet deployment failed:", error);
    process.exit(1);
  });