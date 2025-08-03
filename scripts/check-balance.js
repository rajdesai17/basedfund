const { ethers } = require("hardhat");

async function main() {
  console.log("Checking wallet balance on Base mainnet...");
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const balance = await ethers.provider.getBalance(wallet.address);
  
  console.log("Wallet address:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  // Check if balance is sufficient for deployment (roughly 0.01 ETH)
  const minBalance = ethers.parseEther("0.01");
  if (balance < minBalance) {
    console.log("❌ Insufficient balance for deployment");
    console.log("You need at least 0.01 ETH on Base mainnet");
    console.log("Get Base ETH from: https://bridge.base.org");
  } else {
    console.log("✅ Sufficient balance for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 