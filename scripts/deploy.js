const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainLend AI Universal Smart Contract...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  // ZetaChain System Contract address (testnet)
  const SYSTEM_CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  // Deploy the contract
  const ChainLendAI = await ethers.getContractFactory("ChainLendAI");
  const chainLendAI = await ChainLendAI.deploy(SYSTEM_CONTRACT_ADDRESS);
  
  await chainLendAI.deployed();
  
  console.log("✅ ChainLend AI deployed to:", chainLendAI.address);
  console.log("🔗 System Contract:", SYSTEM_CONTRACT_ADDRESS);
  
  // Create initial lending pools
  console.log("\n🏊 Creating initial lending pools...");
  
  const pools = [
    {
      chainId: 7000, // ZetaChain
      token: "0x05BA149A7bd6dC1F937fA9046A9e05C05f3b18b0", // Mock USDC
      baseAPY: 1520 // 15.20%
    },
    {
      chainId: 1, // Ethereum
      token: "0xA0b86a33E6441b8435b662303c0f479c7e1d5b1e", // Mock ETH
      baseAPY: 1280 // 12.80%
    },
    {
      chainId: 56, // BSC
      token: "0x55d398326f99059fF775485246999027B3197955", // Mock USDT
      baseAPY: 1840 // 18.40%
    }
  ];
  
  for (const pool of pools) {
    try {
      const tx = await chainLendAI.createLendingPool(
        pool.chainId,
        pool.token,
        pool.baseAPY
      );
      await tx.wait();
      console.log(`✅ Created pool: Chain ${pool.chainId}, APY ${pool.baseAPY / 100}%`);
    } catch (error) {
      console.error(`❌ Failed to create pool for chain ${pool.chainId}:`, error.message);
    }
  }
  
  // Add AI recommendations
  console.log("\n🧠 Adding AI recommendations...");
  
  const recommendations = [
    {
      chainId: 7000,
      token: "0x05BA149A7bd6dC1F937fA9046A9e05C05f3b18b0",
      recommendedAPY: 1520,
      riskScore: 25, // Low risk
      confidence: 95,
      reason: "High liquidity and stable collateral ratios"
    },
    {
      chainId: 56,
      token: "0x55d398326f99059fF775485246999027B3197955",
      recommendedAPY: 1840,
      riskScore: 45, // Medium risk
      confidence: 88,
      reason: "High yield opportunity with moderate volatility"
    }
  ];
  
  for (const rec of recommendations) {
    try {
      const tx = await chainLendAI.addAIRecommendation(
        rec.chainId,
        rec.token,
        rec.recommendedAPY,
        rec.riskScore,
        rec.confidence,
        rec.reason
      );
      await tx.wait();
      console.log(`✅ Added AI recommendation: Chain ${rec.chainId}, Confidence ${rec.confidence}%`);
    } catch (error) {
      console.error(`❌ Failed to add AI recommendation:`, error.message);
    }
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract Summary:");
  console.log("   - Contract Address:", chainLendAI.address);
  console.log("   - Network: ZetaChain Testnet");
  console.log("   - Initial Pools:", pools.length);
  console.log("   - AI Recommendations:", recommendations.length);
  
  // Verification instructions
  console.log("\n🔍 To verify the contract, run:");
  console.log(`npx hardhat verify --network zetachain-testnet ${chainLendAI.address} "${SYSTEM_CONTRACT_ADDRESS}"`);
  
  return chainLendAI.address;
}

main()
  .then((address) => {
    console.log("\n✨ Deployment script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });