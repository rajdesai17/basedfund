const { ethers } = require("hardhat");

async function main() {
  console.log("Testing idea posting on Base mainnet...");

  // Contract address from deployment
  const contractAddress = "0x0CFB5CC7bf2019e8a0370933aafCF6fB55028411";
  
  // Get the contract factory
  const FundBase = await ethers.getContractFactory("FundBase");
  
  // Attach to deployed contract
  const fundBase = FundBase.attach(contractAddress);

  try {
    // Test posting an idea
    const ideaId = "test-idea-" + Date.now();
    const title = "Test Startup Idea";
    const description = "This is a test startup idea to verify the contract is working properly.";

    console.log("Posting idea with ID:", ideaId);
    console.log("Title:", title);
    console.log("Description:", description);

    // Estimate gas first
    const gasEstimate = await fundBase.postIdea.estimateGas(ideaId, title, description);
    console.log("Estimated gas:", gasEstimate.toString());

    // Post the idea
    const tx = await fundBase.postIdea(ideaId, title, description);
    console.log("Transaction hash:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Verify the idea was posted
    const ideaCount = await fundBase.getIdeaCount();
    console.log("New total ideas:", ideaCount.toString());

    const postedIdea = await fundBase.getIdea(ideaId);
    console.log("Posted idea details:", postedIdea);

    console.log("✅ Idea posted successfully!");
  } catch (error) {
    console.error("❌ Error posting idea:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 You need more ETH in your wallet for gas fees");
      console.log("Get Base ETH from: https://bridge.base.org");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 