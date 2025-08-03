const { ethers } = require("hardhat");

async function main() {
  console.log("Testing posting idea to contract...");
  
  try {
    // Get the contract
    const contract = await ethers.getContractAt("FundBase", "0xfb4A288351b9F4dD4BfC03a772e842498C93bECE");
    
    console.log("Contract address:", await contract.getAddress());
    
    // Check initial state
    console.log("Initial idea count:", (await contract.getIdeaCount()).toString());
    
    // Post a test idea
    console.log("Posting test idea...");
    const tx = await contract.postIdea(
      "test-idea-1",
      "Test Idea Title",
      "This is a test idea description for testing the contract functionality."
    );
    
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");
    
    // Check state after posting
    console.log("Idea count after posting:", (await contract.getIdeaCount()).toString());
    
    // Get the posted idea
    const idea = await contract.getIdea("test-idea-1");
    console.log("Posted idea:", idea);
    
    // Get all ideas
    const allIdeas = await contract.getAllIdeas();
    console.log("All ideas:", allIdeas);
    
  } catch (error) {
    console.error("Error testing post idea:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 