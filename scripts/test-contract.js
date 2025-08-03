const { ethers } = require("hardhat");

async function main() {
  console.log("Testing deployed contract...");
  
  try {
    // Get the contract
    const contract = await ethers.getContractAt("FundBase", "0xfb4A288351b9F4dD4BfC03a772e842498C93bECE");
    
    console.log("Contract address:", await contract.getAddress());
    
    // Test basic functions
    console.log("Testing getIdeaCount...");
    const ideaCount = await contract.getIdeaCount();
    console.log("Idea count:", ideaCount.toString());
    
    if (ideaCount > 0) {
      console.log("Testing getAllIdeas...");
      const allIdeas = await contract.getAllIdeas();
      console.log("All ideas:", allIdeas);
    } else {
      console.log("No ideas in contract yet");
    }
    
    // Test if getAllIdeas function exists
    console.log("Testing getAllIdeas with empty contract...");
    const emptyIdeas = await contract.getAllIdeas();
    console.log("Empty ideas result:", emptyIdeas);
    
  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 