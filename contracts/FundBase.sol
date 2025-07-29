// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FundBase {
    struct Idea {
        string id;
        string title;
        string description;
        address creator;
        uint256 totalRaised;
        uint256 backerCount;
        uint256 createdAt;
        bool exists;
    }

    struct Backer {
        address wallet;
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    mapping(string => Idea) public ideas;
    mapping(string => Backer[]) public backers;
    mapping(string => mapping(address => bool)) public hasBacked;
    string[] public ideaIds;
    
    // Events
    event IdeaPosted(string indexed id, string title, address creator);
    event IdeaBacked(string indexed id, address backer, uint256 amount);
    event FundsWithdrawn(string indexed id, address creator, uint256 amount);

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
            totalRaised: 0,
            backerCount: 0,
            createdAt: block.timestamp,
            exists: true
        });

        ideaIds.push(_id);
        emit IdeaPosted(_id, _title, msg.sender);
    }

    function backIdea(string memory _id) 
        external 
        payable 
        ideaExists(_id) 
        notAlreadyBacked(_id) 
    {
        require(msg.value > 0, "Must send ETH to back idea");
        require(msg.sender != ideas[_id].creator, "Creator cannot back their own idea");

        // Update idea stats
        ideas[_id].totalRaised += msg.value;
        ideas[_id].backerCount += 1;

        // Add backer
        backers[_id].push(Backer({
            wallet: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        hasBacked[_id][msg.sender] = true;

        emit IdeaBacked(_id, msg.sender, msg.value);
    }

    function withdrawFunds(string memory _id) 
        external 
        ideaExists(_id) 
        onlyCreator(_id) 
    {
        uint256 amount = ideas[_id].totalRaised;
        require(amount > 0, "No funds to withdraw");

        // Reset total raised
        ideas[_id].totalRaised = 0;

        // Transfer funds to creator
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_id, msg.sender, amount);
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
} 