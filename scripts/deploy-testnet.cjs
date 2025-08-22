const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainLend AI to ZetaChain Testnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ZETA");
  
  // ZetaChain Testnet Addresses (Athens Testnet)
  const SYSTEM_CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // ZetaChain Athens Testnet
  const GATEWAY_ADDRESS = "0x6c533f7fe93fae114d0954697069df33c9b74fd7"; // ZetaChain Athens Testnet Gateway
  
  console.log("🔗 System Contract Address:", SYSTEM_CONTRACT_ADDRESS);
  console.log("🌉 Gateway Address:", GATEWAY_ADDRESS);
  
  // Deploy ChainLend AI contract
  console.log("📦 Deploying ChainLend AI contract...");
  const ChainLendAI = await ethers.getContractFactory("ChainLendAI");
  const chainLendAI = await ChainLendAI.deploy(
    SYSTEM_CONTRACT_ADDRESS,
    GATEWAY_ADDRESS
  );
  
  await chainLendAI.waitForDeployment();
  console.log("✅ ChainLend AI deployed to:", await chainLendAI.getAddress());
  
  // Create initial lending pools
  console.log("🏊 Creating initial lending pools...");
  
  // USDC Pool on ZetaChain (Chain ID: 7001)
  await chainLendAI.createLendingPool(
    7001, // ZetaChain testnet
    "0x0000000000000000000000000000000000000000", // USDC address (replace with actual)
    500, // 5% APY
    1000 // 0.1% cross-chain fee
  );
  console.log("✅ USDC pool created on ZetaChain");
  
  // ETH Pool on Ethereum (Chain ID: 1)
  await chainLendAI.createLendingPool(
    1, // Ethereum mainnet
    "0x0000000000000000000000000000000000000000", // ETH address (replace with actual)
    800, // 8% APY
    1500 // 0.15% cross-chain fee
  );
  console.log("✅ ETH pool created on Ethereum");
  
  // BNB Pool on BSC (Chain ID: 56)
  await chainLendAI.createLendingPool(
    56, // BSC mainnet
    "0x0000000000000000000000000000000000000000", // BNB address (replace with actual)
    600, // 6% APY
    1200 // 0.12% cross-chain fee
  );
  console.log("✅ BNB pool created on BSC");
  
  // Add AI recommendations
  console.log("🤖 Adding AI recommendations...");
  
  await chainLendAI.addAIRecommendation(
    7001, // ZetaChain
    "0x0000000000000000000000000000000000000000", // USDC
    500, // 5% APY
    20, // Low risk
    95, // High confidence
    "Stable coin with low volatility, recommended for conservative investors"
  );
  
  await chainLendAI.addAIRecommendation(
    1, // Ethereum
    "0x0000000000000000000000000000000000000000", // ETH
    800, // 8% APY
    40, // Medium risk
    85, // High confidence
    "High liquidity with moderate risk, good for balanced portfolios"
  );
  
  await chainLendAI.addAIRecommendation(
    56, // BSC
    "0x0000000000000000000000000000000000000000", // BNB
    600, // 6% APY
    30, // Medium-low risk
    90, // High confidence
    "Established chain with good yields, recommended for growth"
  );
  
  console.log("✅ AI recommendations added");
  
  // Verify deployment
  console.log("\n🔍 Deployment Verification:");
  console.log("📊 Total Pools:", (await chainLendAI.totalPools()).toString());
  console.log("💰 Total Value Locked:", (await chainLendAI.totalValueLocked()).toString());
  console.log("🤖 AI Recommendations:", (await chainLendAI.aiRecommendationCount()).toString());
  
  console.log("\n🎉 Deployment Complete!");
  const contractAddress = await chainLendAI.getAddress();
  console.log("📋 Contract Address:", contractAddress);
  console.log("🔗 Explorer:", `https://athens3.explorer.zetachain.com/address/${contractAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    network: "zetachain-testnet",
    chainId: 7001,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    pools: [
      { chainId: 7001, token: "USDC", apy: "5%", fee: "0.1%" },
      { chainId: 1, token: "ETH", apy: "8%", fee: "0.15%" },
      { chainId: 56, token: "BNB", apy: "6%", fee: "0.12%" }
    ]
  };
  
  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });