const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainLendAI", function () {
  let chainLendAI;
  let owner;
  let user1;
  let user2;
  let mockToken;
  let systemContract;

  const INITIAL_APY = 1500; // 15%
  const CHAIN_ID = 7000; // ZetaChain
  const LENDING_AMOUNT = ethers.utils.parseEther("1000"); // 1000 tokens

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("Mock USDC", "mUSDC", 18);
    await mockToken.deployed();

    // Deploy mock system contract
    const MockSystemContract = await ethers.getContractFactory("MockSystemContract");
    systemContract = await MockSystemContract.deploy();
    await systemContract.deployed();

    // Deploy ChainLendAI
    const ChainLendAI = await ethers.getContractFactory("ChainLendAI");
    chainLendAI = await ChainLendAI.deploy(systemContract.address);
    await chainLendAI.deployed();

    // Mint tokens to users
    await mockToken.mint(user1.address, ethers.utils.parseEther("10000"));
    await mockToken.mint(user2.address, ethers.utils.parseEther("10000"));

    // Approve contract to spend tokens
    await mockToken.connect(user1).approve(chainLendAI.address, ethers.constants.MaxUint256);
    await mockToken.connect(user2).approve(chainLendAI.address, ethers.constants.MaxUint256);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await chainLendAI.owner()).to.equal(owner.address);
    });

    it("Should set the system contract", async function () {
      expect(await chainLendAI.systemContract()).to.equal(systemContract.address);
    });

    it("Should initialize with zero pools", async function () {
      expect(await chainLendAI.totalPools()).to.equal(0);
      expect(await chainLendAI.totalValueLocked()).to.equal(0);
    });
  });

  describe("Lending Pool Management", function () {
    it("Should create a lending pool", async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
      
      expect(await chainLendAI.totalPools()).to.equal(1);
      
      const poolId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address"],
          [CHAIN_ID, mockToken.address]
        )
      );
      
      const poolInfo = await chainLendAI.getPoolInfo(poolId);
      expect(poolInfo.token).to.equal(mockToken.address);
      expect(poolInfo.chainId).to.equal(CHAIN_ID);
      expect(poolInfo.isActive).to.be.true;
    });

    it("Should not allow duplicate pools", async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
      
      await expect(
        chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY)
      ).to.be.revertedWith("Pool already exists");
    });

    it("Should not allow invalid APY", async function () {
      await expect(
        chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, 0)
      ).to.be.revertedWith("Invalid APY");
      
      await expect(
        chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, 10001)
      ).to.be.revertedWith("Invalid APY");
    });
  });

  describe("Lending", function () {
    beforeEach(async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
    });

    it("Should allow users to lend tokens", async function () {
      const initialBalance = await mockToken.balanceOf(user1.address);
      
      await chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, LENDING_AMOUNT);
      
      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance.sub(LENDING_AMOUNT));
      
      expect(await chainLendAI.totalValueLocked()).to.equal(LENDING_AMOUNT);
    });

    it("Should update user position correctly", async function () {
      await chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, LENDING_AMOUNT);
      
      const poolId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address"],
          [CHAIN_ID, mockToken.address]
        )
      );
      
      const position = await chainLendAI.userPositions(user1.address, poolId);
      expect(position.amount).to.equal(LENDING_AMOUNT);
    });

    it("Should not allow lending below minimum amount", async function () {
      const smallAmount = ethers.utils.parseUnits("0.5", 6); // 0.5 USDC
      
      await expect(
        chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, smallAmount)
      ).to.be.revertedWith("Amount too small");
    });

    it("Should emit FundsLent event", async function () {
      await expect(
        chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, LENDING_AMOUNT)
      )
        .to.emit(chainLendAI, "FundsLent")
        .withArgs(user1.address, CHAIN_ID, mockToken.address, LENDING_AMOUNT);
    });
  });

  describe("Withdrawing", function () {
    beforeEach(async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
      await chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, LENDING_AMOUNT);
    });

    it("Should allow users to withdraw tokens", async function () {
      const withdrawAmount = ethers.utils.parseEther("500");
      const initialBalance = await mockToken.balanceOf(user1.address);
      
      await chainLendAI.connect(user1).withdraw(CHAIN_ID, mockToken.address, withdrawAmount);
      
      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance.add(withdrawAmount));
    });

    it("Should not allow withdrawing more than balance", async function () {
      const excessiveAmount = ethers.utils.parseEther("2000");
      
      await expect(
        chainLendAI.connect(user1).withdraw(CHAIN_ID, mockToken.address, excessiveAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should update TVL correctly after withdrawal", async function () {
      const withdrawAmount = ethers.utils.parseEther("500");
      const initialTVL = await chainLendAI.totalValueLocked();
      
      await chainLendAI.connect(user1).withdraw(CHAIN_ID, mockToken.address, withdrawAmount);
      
      const finalTVL = await chainLendAI.totalValueLocked();
      expect(finalTVL).to.equal(initialTVL.sub(withdrawAmount));
    });
  });

  describe("Interest Calculation", function () {
    beforeEach(async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
      await chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, LENDING_AMOUNT);
    });

    it("Should calculate interest correctly", async function () {
      const poolId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address"],
          [CHAIN_ID, mockToken.address]
        )
      );

      // Fast forward time by 1 year
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      const interest = await chainLendAI.calculateAccruedInterest(user1.address, poolId);
      
      // Expected interest = 1000 * 15% = 150 tokens (approximately)
      const expectedInterest = LENDING_AMOUNT.mul(INITIAL_APY).div(10000);
      expect(interest).to.be.closeTo(expectedInterest, ethers.utils.parseEther("1"));
    });
  });

  describe("AI Recommendations", function () {
    it("Should add AI recommendations", async function () {
      const riskScore = 25;
      const confidence = 95;
      const reason = "High liquidity and stable collateral ratios";

      await chainLendAI.addAIRecommendation(
        CHAIN_ID,
        mockToken.address,
        INITIAL_APY,
        riskScore,
        confidence,
        reason
      );

      const recommendation = await chainLendAI.aiRecommendations(0);
      expect(recommendation.chainId).to.equal(CHAIN_ID);
      expect(recommendation.token).to.equal(mockToken.address);
      expect(recommendation.riskScore).to.equal(riskScore);
      expect(recommendation.confidence).to.equal(confidence);
    });

    it("Should not allow invalid risk scores", async function () {
      await expect(
        chainLendAI.addAIRecommendation(
          CHAIN_ID,
          mockToken.address,
          INITIAL_APY,
          101, // Invalid risk score
          95,
          "Test reason"
        )
      ).to.be.revertedWith("Invalid risk score");
    });
  });

  describe("Portfolio Management", function () {
    beforeEach(async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
      await chainLendAI.connect(user1).lend(CHAIN_ID, mockToken.address, LENDING_AMOUNT);
    });

    it("Should calculate user portfolio value", async function () {
      const portfolioValue = await chainLendAI.getUserPortfolioValue(user1.address);
      expect(portfolioValue).to.be.gte(LENDING_AMOUNT);
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      await chainLendAI.createLendingPool(CHAIN_ID, mockToken.address, INITIAL_APY);
    });

    it("Should allow owner to pause pools", async function () {
      const poolId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address"],
          [CHAIN_ID, mockToken.address]
        )
      );

      await chainLendAI.pausePool(poolId);
      
      const poolInfo = await chainLendAI.getPoolInfo(poolId);
      expect(poolInfo.isActive).to.be.false;
    });

    it("Should not allow non-owner to pause pools", async function () {
      const poolId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address"],
          [CHAIN_ID, mockToken.address]
        )
      );

      await expect(
        chainLendAI.connect(user1).pausePool(poolId)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

// Mock contracts for testing
const MockERC20 = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol) {}
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
`;

const MockSystemContract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockSystemContract {
    // Mock implementation for testing
}
`;