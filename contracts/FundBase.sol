// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FundBase {
    using SafeERC20 for IERC20;

    struct Idea {
        string id;
        string title;
        string description;
        address creator;
        uint256 totalRaisedETH;
        uint256 backerCount;
        uint256 createdAt;
        bool exists;
    }

    struct Backer {
        address wallet;
        address token;
        uint256 amount;
        uint256 timestamp;
    }

    struct TokenBalance {
        address token;
        uint256 amount;
    }

    // State variables
    mapping(string => Idea) public ideas;
    mapping(string => Backer[]) public backers;
    mapping(string => mapping(address => bool)) public hasBacked;
    mapping(string => mapping(address => uint256)) public tokenBalances; // ideaId => token => amount
    string[] public ideaIds;
    
    // Supported tokens
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC
    address public constant ZORA = 0x0000000000000000000000000000000000000000; // Replace with actual ZORA address
    address public constant ETH = address(0); // Native ETH
    
    // Events
    event IdeaPosted(string indexed id, string title, address creator);
    event IdeaBacked(string indexed id, address backer, address token, uint256 amount);
    event FundsWithdrawn(string indexed id, address creator, address token, uint256 amount);

    // Modifiers
    modifier ideaExists(string memory _id) {
        require(ideas[_id].exists, "Idea does not exist");
        _;
    }

    modifier onlyCreator(string memory _id) {
        require(ideas[_id].creator == msg.sender, "Only creator can withdraw");
        _;
    }

    modifier notAlreadyBacked(string memory _id) {
        require(!hasBacked[_id][msg.sender], "Already backed this idea");
        _;
    }

    modifier validToken(address _token) {
        require(_token == ETH || _token == USDC || _token == ZORA, "Unsupported token");
        _;
    }

    // Functions
    function postIdea(
        string memory _id,
        string memory _title,
        string memory _description
    ) external {
        require(bytes(_id).length > 0, "ID cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(!ideas[_id].exists, "Idea ID already exists");

        ideas[_id] = Idea({
            id: _id,
            title: _title,
            description: _description,
            creator: msg.sender,
            totalRaisedETH: 0,
            backerCount: 0,
            createdAt: block.timestamp,
            exists: true
        });

        ideaIds.push(_id);
        emit IdeaPosted(_id, _title, msg.sender);
    }

    function backIdeaWithETH(string memory _id) 
        external 
        payable 
        ideaExists(_id) 
        notAlreadyBacked(_id) 
    {
        require(msg.value > 0, "Must send ETH to back idea");
        require(msg.sender != ideas[_id].creator, "Creator cannot back their own idea");

        // Update idea stats
        ideas[_id].totalRaisedETH += msg.value;
        ideas[_id].backerCount += 1;
        tokenBalances[_id][ETH] += msg.value;

        // Add backer
        backers[_id].push(Backer({
            wallet: msg.sender,
            token: ETH,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        hasBacked[_id][msg.sender] = true;

        emit IdeaBacked(_id, msg.sender, ETH, msg.value);
    }

    function backIdeaWithToken(
        string memory _id, 
        address _token, 
        uint256 _amount
    ) 
        external 
        ideaExists(_id) 
        notAlreadyBacked(_id) 
        validToken(_token) 
    {
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.sender != ideas[_id].creator, "Creator cannot back their own idea");
        require(_token != ETH, "Use backIdeaWithETH for ETH");

        // Transfer tokens from user to contract
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        // Update idea stats
        ideas[_id].backerCount += 1;
        tokenBalances[_id][_token] += _amount;

        // Add backer
        backers[_id].push(Backer({
            wallet: msg.sender,
            token: _token,
            amount: _amount,
            timestamp: block.timestamp
        }));

        hasBacked[_id][msg.sender] = true;

        emit IdeaBacked(_id, msg.sender, _token, _amount);
    }

    function withdrawFunds(string memory _id) 
        external 
        ideaExists(_id) 
        onlyCreator(_id) 
    {
        uint256 ethAmount = tokenBalances[_id][ETH];
        uint256 usdcAmount = tokenBalances[_id][USDC];
        uint256 zoraAmount = tokenBalances[_id][ZORA];

        require(ethAmount > 0 || usdcAmount > 0 || zoraAmount > 0, "No funds to withdraw");

        // Reset balances
        tokenBalances[_id][ETH] = 0;
        tokenBalances[_id][USDC] = 0;
        tokenBalances[_id][ZORA] = 0;

        // Transfer ETH
        if (ethAmount > 0) {
            (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
            require(success, "ETH transfer failed");
            emit FundsWithdrawn(_id, msg.sender, ETH, ethAmount);
        }

        // Transfer USDC
        if (usdcAmount > 0) {
            IERC20(USDC).safeTransfer(msg.sender, usdcAmount);
            emit FundsWithdrawn(_id, msg.sender, USDC, usdcAmount);
        }

        // Transfer ZORA
        if (zoraAmount > 0) {
            IERC20(ZORA).safeTransfer(msg.sender, zoraAmount);
            emit FundsWithdrawn(_id, msg.sender, ZORA, zoraAmount);
        }
    }

    // View functions
    function getIdea(string memory _id) external view returns (Idea memory) {
        return ideas[_id];
    }

    function getBackers(string memory _id) external view returns (Backer[] memory) {
        return backers[_id];
    }

    function getAllIdeas() external view returns (Idea[] memory) {
        Idea[] memory allIdeas = new Idea[](ideaIds.length);
        for (uint i = 0; i < ideaIds.length; i++) {
            allIdeas[i] = ideas[ideaIds[i]];
        }
        return allIdeas;
    }

    function getIdeaCount() external view returns (uint256) {
        return ideaIds.length;
    }

    function hasUserBacked(string memory _id, address _user) external view returns (bool) {
        return hasBacked[_id][_user];
    }

    function getTokenBalance(string memory _id, address _token) external view returns (uint256) {
        return tokenBalances[_id][_token];
    }

    function getAllTokenBalances(string memory _id) external view returns (TokenBalance[] memory) {
        TokenBalance[] memory balances = new TokenBalance[](3);
        balances[0] = TokenBalance(ETH, tokenBalances[_id][ETH]);
        balances[1] = TokenBalance(USDC, tokenBalances[_id][USDC]);
        balances[2] = TokenBalance(ZORA, tokenBalances[_id][ZORA]);
        return balances;
    }
} 