const { ethers } = require("hardhat");

async function main() {
  console.log("Testing contract read operations on Base mainnet...");

  // Contract address from deployment
  const contractAddress = "0x0CFB5CC7bf2019e8a0370933aafCF6fB55028411";
  
  // Get the contract factory
  const FundBase = await ethers.getContractFactory("FundBase");
  
  // Attach to deployed contract
  const fundBase = FundBase.attach(contractAddress);

  try {
    // Test reading idea count
    const ideaCount = await fundBase.getIdeaCount();
    console.log("Total ideas in contract:", ideaCount.toString());

    // Test reading all ideas
    const allIdeas = await fundBase.getAllIdeas();
    console.log("All ideas from contract:", allIdeas);

    // Test reading specific idea if exists
    if (ideaCount > 0) {
      const firstIdea = await fundBase.getIdea("test-idea-1");
      console.log("First idea details:", firstIdea);
    }

    console.log("✅ Contract read operations successful!");
  } catch (error) {
    console.error("❌ Error reading from contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 