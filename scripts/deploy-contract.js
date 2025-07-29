const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FundBase contract to Base...");

  // Get the contract factory
  const FundBase = await ethers.getContractFactory("FundBase");

  // Deploy the contract
  const fundBase = await FundBase.deploy();

  // Wait for deployment to complete
  await fundBase.waitForDeployment();

  const address = await fundBase.getAddress();
  console.log("FundBase deployed to:", address);

  // Verify the contract on BaseScan
  console.log("Verifying contract on BaseScan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }

  console.log("Deployment complete!");
  console.log("Contract address:", address);
  console.log("Add this to your .env file:");
  console.log(`NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 