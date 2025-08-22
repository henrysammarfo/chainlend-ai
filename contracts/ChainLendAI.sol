// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IZRC20.sol";
import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IGatewayZEVM.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainLend AI - ZetaChain Universal Smart Contract
 * @dev Cross-chain lending platform using ZetaChain's Universal Smart Contract architecture
 * @notice This contract enables lending and borrowing across multiple blockchains through ZetaChain
 */
contract ChainLendAI is ReentrancyGuard, Ownable {
    SystemContract public immutable systemContract;
    IGatewayZEVM public immutable gateway;
    
    // Events
    event LendingPoolCreated(uint256 indexed chainId, address indexed token, uint256 apy);
    event FundsLent(address indexed user, uint256 indexed chainId, address indexed token, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 indexed chainId, address indexed token, uint256 amount);
    event InterestPaid(address indexed user, uint256 indexed chainId, address indexed token, uint256 interest);
    event CrossChainCallInitiated(uint256 indexed sourceChain, uint256 indexed targetChain, address indexed user, uint256 amount);
    event CrossChainCallCompleted(uint256 indexed sourceChain, uint256 indexed targetChain, address indexed user, uint256 amount);
    
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
        uint256 crossChainFee;
    }
    
    struct UserPosition {
        uint256 amount;
        uint256 timestamp;
        uint256 accruedInterest;
        uint256 lastClaimTime;
        uint256 crossChainBalance;
    }
    
    struct AIRecommendation {
        uint256 chainId;
        address token;
        uint256 recommendedAPY;
        uint256 riskScore; // 0-100
        uint256 confidence; // 0-100
        string reason;
        uint256 timestamp;
    }
    
    struct CrossChainRequest {
        uint256 sourceChain;
        uint256 targetChain;
        address user;
        address token;
        uint256 amount;
        string action;
        bool isCompleted;
        uint256 timestamp;
    }
    
    // State variables
    mapping(bytes32 => LendingPool) public lendingPools;
    mapping(address => mapping(bytes32 => UserPosition)) public userPositions;
    mapping(uint256 => AIRecommendation) public aiRecommendations;
    mapping(bytes32 => CrossChainRequest) public crossChainRequests;
    
    bytes32[] public poolIds;
    uint256 public totalPools;
    uint256 public totalValueLocked;
    uint256 public aiRecommendationCount;
    uint256 public crossChainRequestCount;
    
    // Constants
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_LENDING_AMOUNT = 1e6; // 1 USDC minimum
    uint256 public constant CROSS_CHAIN_GAS_LIMIT = 500000;
    
    // Modifiers
    modifier onlyGateway() {
        require(msg.sender == address(gateway), "Only gateway can call");
        _;
    }
    
    modifier validChain(uint256 _chainId) {
        require(_chainId > 0, "Invalid chain ID");
        _;
    }
    
    constructor(
        address _systemContract,
        address _gateway
    ) {
        systemContract = SystemContract(_systemContract);
        gateway = IGatewayZEVM(_gateway);
    }
    
    /**
     * @dev Create a new lending pool for a specific token and chain
     */
    function createLendingPool(
        uint256 _chainId,
        address _token,
        uint256 _baseAPY,
        uint256 _crossChainFee
    ) external onlyOwner validChain(_chainId) {
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        
        require(lendingPools[poolId].token == address(0), "Pool already exists");
        require(_baseAPY > 0 && _baseAPY <= 10000, "Invalid APY"); // Max 100%
        require(_crossChainFee > 0, "Invalid cross-chain fee");
        
        lendingPools[poolId] = LendingPool({
            token: _token,
            chainId: _chainId,
            totalSupply: 0,
            totalBorrowed: 0,
            baseAPY: _baseAPY,
            utilizationRate: 0,
            isActive: true,
            lastUpdateTime: block.timestamp,
            crossChainFee: _crossChainFee
        });
        
        poolIds.push(poolId);
        totalPools++;
        
        emit LendingPoolCreated(_chainId, _token, _baseAPY);
    }
    
    /**
     * @dev Lend tokens to a specific pool (same chain)
     */
    function lend(
        uint256 _chainId,
        address _token,
        uint256 _amount
    ) external nonReentrant validChain(_chainId) {
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
     * @dev Initiate cross-chain lending to another chain
     */
    function initiateCrossChainLend(
        uint256 _sourceChain,
        uint256 _targetChain,
        address _token,
        uint256 _amount
    ) external nonReentrant validChain(_sourceChain) validChain(_targetChain) {
        require(_amount >= MIN_LENDING_AMOUNT, "Amount too small");
        require(_sourceChain != _targetChain, "Source and target chains must be different");
        
        bytes32 sourcePoolId = keccak256(abi.encodePacked(_sourceChain, _token));
        LendingPool storage sourcePool = lendingPools[sourcePoolId];
        
        require(sourcePool.isActive, "Source pool not active");
        require(sourcePool.token != address(0), "Source pool does not exist");
        
        // Check if user has enough balance
        UserPosition storage position = userPositions[msg.sender][sourcePoolId];
        require(position.amount >= _amount, "Insufficient balance");
        
        // Calculate cross-chain fee
        uint256 crossChainFee = sourcePool.crossChainFee;
        require(_amount > crossChainFee, "Amount must be greater than cross-chain fee");
        
        // Deduct amount from source chain position
        position.amount -= _amount;
        position.crossChainBalance += _amount;
        
        // Create cross-chain request
        bytes32 requestId = keccak256(abi.encodePacked(
            _sourceChain,
            _targetChain,
            msg.sender,
            _token,
            _amount,
            block.timestamp
        ));
        
        crossChainRequests[requestId] = CrossChainRequest({
            sourceChain: _sourceChain,
            targetChain: _targetChain,
            user: msg.sender,
            token: _token,
            amount: _amount,
            action: "lend",
            isCompleted: false,
            timestamp: block.timestamp
        });
        
        crossChainRequestCount++;
        
        // Initiate cross-chain call through ZetaChain Gateway
        bytes memory message = abi.encode(
            _targetChain,
            _token,
            msg.sender,
            _amount,
            "lend",
            requestId
        );
        
        // Call ZetaChain Gateway to initiate cross-chain transaction
        // The call function takes: receiver, zrc20, message, callOptions, revertOptions
        bytes memory receiver = abi.encodePacked(address(this)); // receiver contract on target chain
        
        CallOptions memory callOptions = CallOptions({
            gasLimit: CROSS_CHAIN_GAS_LIMIT,
            isArbitraryCall: false
        });
        
        RevertOptions memory revertOptions = RevertOptions({
            revertAddress: address(0),
            callOnRevert: false,
            abortAddress: address(0),
            revertMessage: "",
            onRevertGasLimit: 0
        });
        
        gateway.call(
            receiver,
            address(0), // Use ZETA for gas fees
            message,
            callOptions,
            revertOptions
        );
        
        emit CrossChainCallInitiated(_sourceChain, _targetChain, msg.sender, _amount);
    }
    
    /**
     * @dev Handle cross-chain call from ZetaChain Gateway
     * This function is called by the Gateway when a cross-chain message arrives
     */
    function onCrossChainMessage(
        uint256 _sourceChain,
        address /* _sender */,
        bytes calldata _message
    ) external onlyGateway {
        // Decode the cross-chain message
        (
            uint256 targetChain,
            address token,
            address user,
            uint256 amount,
            string memory action,
            bytes32 requestId
        ) = abi.decode(_message, (uint256, address, address, uint256, string, bytes32));
        
        // Verify the cross-chain request exists
        CrossChainRequest storage request = crossChainRequests[requestId];
        require(request.sourceChain == _sourceChain, "Invalid source chain");
        require(request.user == user, "Invalid user");
        require(request.token == token, "Invalid token");
        require(request.amount == amount, "Invalid amount");
        require(!request.isCompleted, "Request already completed");
        
        // Handle the cross-chain action
        if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("lend"))) {
            _handleCrossChainLend(targetChain, token, user, amount, requestId);
        } else if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("withdraw"))) {
            _handleCrossChainWithdraw(targetChain, token, user, amount, requestId);
        }
        
        // Mark request as completed
        request.isCompleted = true;
        
        emit CrossChainCallCompleted(_sourceChain, targetChain, user, amount);
    }
    
    /**
     * @dev Handle cross-chain lending
     */
    function _handleCrossChainLend(
        uint256 _chainId,
        address _token,
        address _user,
        uint256 _amount,
        bytes32 /* _requestId */
    ) internal {
        bytes32 poolId = keccak256(abi.encodePacked(_chainId, _token));
        LendingPool storage pool = lendingPools[poolId];
        
        // Create pool if it doesn't exist
        if (pool.token == address(0)) {
            pool.token = _token;
            pool.chainId = _chainId;
            pool.totalSupply = 0;
            pool.totalBorrowed = 0;
            pool.baseAPY = 500; // Default 5% APY
            pool.utilizationRate = 0;
            pool.isActive = true;
            pool.lastUpdateTime = block.timestamp;
            pool.crossChainFee = 1000; // Default 0.1% fee
            
            poolIds.push(poolId);
            totalPools++;
        }
        
        require(pool.isActive, "Pool not active");
        
        // Update user position
        UserPosition storage position = userPositions[_user][poolId];
        position.amount += _amount;
        position.timestamp = block.timestamp;
        position.lastClaimTime = block.timestamp;
        
        // Update pool
        pool.totalSupply += _amount;
        pool.lastUpdateTime = block.timestamp;
        
        // Update global TVL
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
        uint256 _amount,
        bytes32 /* _requestId */
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
        
        // Update global TVL
        totalValueLocked -= _amount;
        
        emit FundsWithdrawn(_user, _chainId, _token, _amount);
    }
    
    /**
     * @dev Withdraw tokens from a lending position (same chain)
     */
    function withdraw(
        uint256 _chainId,
        address _token,
        uint256 _amount
    ) external nonReentrant validChain(_chainId) {
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
     * @dev Add AI recommendation for a lending opportunity
     */
    function addAIRecommendation(
        uint256 _chainId,
        address _token,
        uint256 _recommendedAPY,
        uint256 _riskScore,
        uint256 _confidence,
        string memory _reason
    ) external onlyOwner validChain(_chainId) {
        require(_riskScore <= 100, "Invalid risk score");
        require(_confidence <= 100, "Invalid confidence");
        
        aiRecommendations[aiRecommendationCount] = AIRecommendation({
            chainId: _chainId,
            token: _token,
            recommendedAPY: _recommendedAPY,
            riskScore: _riskScore,
            confidence: _confidence,
            reason: _reason,
            timestamp: block.timestamp
        });
        
        aiRecommendationCount++;
    }
    
    /**
     * @dev Get user's total portfolio value across all chains
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
        bool isActive,
        uint256 crossChainFee
    ) {
        LendingPool memory pool = lendingPools[_poolId];
        return (
            pool.token,
            pool.chainId,
            pool.totalSupply,
            calculateDynamicAPY(_poolId),
            pool.utilizationRate,
            pool.isActive,
            pool.crossChainFee
        );
    }
    
    /**
     * @dev Get cross-chain request information
     */
    function getCrossChainRequest(bytes32 _requestId) external view returns (
        uint256 sourceChain,
        uint256 targetChain,
        address user,
        address token,
        uint256 amount,
        string memory action,
        bool isCompleted,
        uint256 timestamp
    ) {
        CrossChainRequest memory request = crossChainRequests[_requestId];
        return (
            request.sourceChain,
            request.targetChain,
            request.user,
            request.token,
            request.amount,
            request.action,
            request.isCompleted,
            request.timestamp
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
    
    /**
     * @dev Update cross-chain fee for a pool
     */
    function updateCrossChainFee(bytes32 _poolId, uint256 _newFee) external onlyOwner {
        require(_newFee > 0, "Invalid fee");
        lendingPools[_poolId].crossChainFee = _newFee;
    }
    
    /**
     * @dev Emergency withdrawal function for owner
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
    }
}