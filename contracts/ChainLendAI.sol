// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import "@zetachain/protocol-contracts/contracts/Revert.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainLend AI Universal Smart Contract
 * @dev Cross-chain lending platform powered by ZetaChain Universal Smart Contracts
 * @notice This contract enables lending and borrowing across multiple blockchains
 */
contract ChainLendAI is UniversalContract, ReentrancyGuard, Ownable {
    SystemContract public systemContract;
    
    // Events
    event LendingPoolCreated(uint256 indexed chainId, address indexed token, uint256 apy);
    event FundsLent(address indexed user, uint256 indexed chainId, address indexed token, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 indexed chainId, address indexed token, uint256 amount);
    event InterestPaid(address indexed user, uint256 indexed chainId, address indexed token, uint256 interest);
    event CrossChainTransfer(uint256 indexed fromChain, uint256 indexed toChain, address indexed token, uint256 amount);
    
    // Structs
    struct LendingPool {
        address token;
        uint256 chainId;
        uint256 totalSupply;
        uint256 totalBorrowed;
        uint256 baseAPY;
        uint256 utilizationRate;
        bool isActive;
        uint256 lastUpdateTime;
    }
    
    struct UserPosition {
        uint256 amount;
        uint256 timestamp;
        uint256 accruedInterest;
        uint256 lastClaimTime;
    }
    
    struct AIRecommendation {
        uint256 chainId;
        address token;
        uint256 recommendedAPY;
        uint256 riskScore; // 0-100
        uint256 confidence; // 0-100
        string reason;
    }
    
    // State variables
    mapping(bytes32 => LendingPool) public lendingPools;
    mapping(address => mapping(bytes32 => UserPosition)) public userPositions;
    mapping(uint256 => AIRecommendation) public aiRecommendations;
    
    bytes32[] public poolIds;
    uint256 public totalPools;
    uint256 public totalValueLocked;
    uint256 public aiRecommendationCount;
    
    // Constants
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_LENDING_AMOUNT = 1e6; // 1 USDC minimum
    
    constructor(address _systemContract) {
        systemContract = SystemContract(_systemContract);
    }
    
    /**
     * @dev Create a new lending pool for a specific token and chain
     */
    function createLendingPool(
        uint256 _chainId,
        address _token,
        uint256 _baseAPY
    ) external onlyOwner {
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        
        require(lendingPools[poolId].token == address(0), "Pool already exists");
        require(_baseAPY > 0 && _baseAPY <= 10000, "Invalid APY"); // Max 100%
        
        lendingPools[poolId] = LendingPool({
            token: _token,
            chainId: _chainId,
            totalSupply: 0,
            totalBorrowed: 0,
            baseAPY: _baseAPY,
            utilizationRate: 0,
            isActive: true,
            lastUpdateTime: block.timestamp
        });
        
        poolIds.push(poolId);
        totalPools++;
        
        emit LendingPoolCreated(_chainId, _token, _baseAPY);
    }
    
    /**
     * @dev Lend tokens to a specific pool
     */
    function lend(
        uint256 _chainId,
        address _token,
        uint256 _amount
    ) external nonReentrant {
        require(_amount >= MIN_LENDING_AMOUNT, "Amount too small");
        
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        LendingPool storage pool = lendingPools[poolId];
        
        require(pool.isActive, "Pool not active");
        require(pool.token != address(0), "Pool does not exist");
        
        // Transfer tokens from user
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        
        // Update user position
        UserPosition storage position = userPositions[msg.sender][poolId];
        
        // Calculate and add accrued interest
        if (position.amount > 0) {
            uint256 interest = calculateAccruedInterest(msg.sender, poolId);
            position.accruedInterest += interest;
        }
        
        position.amount += _amount;
        position.timestamp = block.timestamp;
        position.lastClaimTime = block.timestamp;
        
        // Update pool
        pool.totalSupply += _amount;
        pool.lastUpdateTime = block.timestamp;
        
        // Update global TVL
        totalValueLocked += _amount;
        
        emit FundsLent(msg.sender, _chainId, _token, _amount);
    }
    
    /**
     * @dev Withdraw tokens from a lending position
     */
    function withdraw(
        uint256 _chainId,
        address _token,
        uint256 _amount
    ) external nonReentrant {
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        UserPosition storage position = userPositions[msg.sender][poolId];
        
        require(position.amount >= _amount, "Insufficient balance");
        
        // Calculate and pay accrued interest
        uint256 interest = calculateAccruedInterest(msg.sender, poolId);
        if (interest > 0) {
            position.accruedInterest += interest;
            emit InterestPaid(msg.sender, _chainId, _token, interest);
        }
        
        // Update position
        position.amount -= _amount;
        position.lastClaimTime = block.timestamp;
        
        // Update pool
        LendingPool storage pool = lendingPools[poolId];
        pool.totalSupply -= _amount;
        pool.lastUpdateTime = block.timestamp;
        
        // Update global TVL
        totalValueLocked -= _amount;
        
        // Transfer tokens to user
        IERC20(_token).transfer(msg.sender, _amount);
        
        emit FundsWithdrawn(msg.sender, _chainId, _token, _amount);
    }
    
    /**
     * @dev Calculate accrued interest for a user position
     */
    function calculateAccruedInterest(
        address _user,
        bytes32 _poolId
    ) public view returns (uint256) {
        UserPosition memory position = userPositions[_user][_poolId];
        
        if (position.amount == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - position.lastClaimTime;
        uint256 currentAPY = calculateDynamicAPY(_poolId);
        
        // Interest = Principal * APY * Time / SECONDS_PER_YEAR
        uint256 interest = (position.amount * currentAPY * timeElapsed) / 
                          (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return interest;
    }
    
    /**
     * @dev Calculate dynamic APY based on utilization rate
     */
    function calculateDynamicAPY(bytes32 _poolId) public view returns (uint256) {
        LendingPool memory pool = lendingPools[_poolId];
        
        if (pool.totalSupply == 0) return pool.baseAPY;
        
        // Utilization rate = totalBorrowed / totalSupply
        uint256 utilizationRate = (pool.totalBorrowed * BASIS_POINTS) / pool.totalSupply;
        
        // Dynamic APY increases with utilization
        // APY = baseAPY * (1 + utilizationRate)
        uint256 dynamicAPY = pool.baseAPY + (pool.baseAPY * utilizationRate) / BASIS_POINTS;
        
        return dynamicAPY;
    }
    
    /**
     * @dev Cross-chain message handling (ZetaChain Universal Contract)
     */
    function onCall(
        MessageContext calldata context,
        address /* zrc20 */,
        uint256 amount,
        bytes calldata message
    ) external override {
        // Decode cross-chain message
        (uint256 targetChain, address targetToken, address user, string memory action) = 
            abi.decode(message, (uint256, address, address, string));
        
        if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("lend"))) {
            // Handle cross-chain lending
            _handleCrossChainLend(targetChain, targetToken, user, amount);
        } else if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("withdraw"))) {
            // Handle cross-chain withdrawal
            _handleCrossChainWithdraw(targetChain, targetToken, user, amount);
        }
        
        emit CrossChainTransfer(context.chainID, targetChain, targetToken, amount);
    }
    
    /**
     * @dev Handle cross-chain lending
     */
    function _handleCrossChainLend(
        uint256 _chainId,
        address _token,
        address _user,
        uint256 _amount
    ) internal {
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        LendingPool storage pool = lendingPools[poolId];
        
        require(pool.isActive, "Pool not active");
        
        // Update user position
        UserPosition storage position = userPositions[_user][poolId];
        position.amount += _amount;
        position.timestamp = block.timestamp;
        position.lastClaimTime = block.timestamp;
        
        // Update pool
        pool.totalSupply += _amount;
        pool.lastUpdateTime = block.timestamp;
        
        totalValueLocked += _amount;
        
        emit FundsLent(_user, _chainId, _token, _amount);
    }
    
    /**
     * @dev Handle cross-chain withdrawal
     */
    function _handleCrossChainWithdraw(
        uint256 _chainId,
        address _token,
        address _user,
        uint256 _amount
    ) internal {
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        UserPosition storage position = userPositions[_user][poolId];
        
        require(position.amount >= _amount, "Insufficient balance");
        
        // Update position
        position.amount -= _amount;
        position.lastClaimTime = block.timestamp;
        
        // Update pool
        LendingPool storage pool = lendingPools[poolId];
        pool.totalSupply -= _amount;
        pool.lastUpdateTime = block.timestamp;
        
        totalValueLocked -= _amount;
        
        emit FundsWithdrawn(_user, _chainId, _token, _amount);
    }
    
    /**
     * @dev Add AI recommendation for a lending opportunity
     */
    function addAIRecommendation(
        uint256 _chainId,
        address _token,
        uint256 _recommendedAPY,
        uint256 _riskScore,
        uint256 _confidence,
        string memory _reason
    ) external onlyOwner {
        require(_riskScore <= 100, "Invalid risk score");
        require(_confidence <= 100, "Invalid confidence");
        
        aiRecommendations[aiRecommendationCount] = AIRecommendation({
            chainId: _chainId,
            token: _token,
            recommendedAPY: _recommendedAPY,
            riskScore: _riskScore,
            confidence: _confidence,
            reason: _reason
        });
        
        aiRecommendationCount++;
    }
    
    /**
     * @dev Get user's total portfolio value
     */
    function getUserPortfolioValue(address _user) external view returns (uint256 totalValue) {
        for (uint256 i = 0; i < poolIds.length; i++) {
            bytes32 poolId = poolIds[i];
            UserPosition memory position = userPositions[_user][poolId];
            
            if (position.amount > 0) {
                uint256 interest = calculateAccruedInterest(_user, poolId);
                totalValue += position.amount + position.accruedInterest + interest;
            }
        }
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo(bytes32 _poolId) external view returns (
        address token,
        uint256 chainId,
        uint256 totalSupply,
        uint256 currentAPY,
        uint256 utilizationRate,
        bool isActive
    ) {
        LendingPool memory pool = lendingPools[_poolId];
        return (
            pool.token,
            pool.chainId,
            pool.totalSupply,
            calculateDynamicAPY(_poolId),
            pool.utilizationRate,
            pool.isActive
        );
    }
    
    /**
     * @dev Emergency pause function
     */
    function pausePool(bytes32 _poolId) external onlyOwner {
        lendingPools[_poolId].isActive = false;
    }
    
    /**
     * @dev Emergency unpause function
     */
    function unpausePool(bytes32 _poolId) external onlyOwner {
        lendingPools[_poolId].isActive = true;
    }
}