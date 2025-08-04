require('dotenv').config();

console.log('🔧 Wallet Configuration Test');
console.log('============================');

// Check environment variables
const requiredVars = [
  'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
  'NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME',
  'NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS'
];

console.log('\n📋 Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
  }
});

// Test Base network configuration
console.log('\n🌐 Base Network Configuration:');
const baseConfig = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org'
};

console.log(`Chain ID: ${baseConfig.chainId}`);
console.log(`Network: ${baseConfig.name}`);
console.log(`RPC URL: ${baseConfig.rpcUrl}`);

// Test contract address format
console.log('\n📄 Contract Address Validation:');
const contractAddress = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS;
if (contractAddress && contractAddress.startsWith('0x') && contractAddress.length === 42) {
  console.log(`✅ Contract address format is valid: ${contractAddress}`);
} else {
  console.log(`❌ Contract address format is invalid: ${contractAddress}`);
}

console.log('\n💡 Troubleshooting Tips:');
console.log('1. Ensure your Coinbase Developer Platform project is configured for Base mainnet');
console.log('2. Verify your API key has proper permissions');
console.log('3. Check that your project name matches exactly in the Coinbase Developer Console');
console.log('4. Try switching to Base Sepolia testnet first to isolate mainnet issues');
console.log('5. Clear browser cache and restart the development server');

console.log('\n🚀 To restart with new configuration:');
console.log('npm run dev'); 