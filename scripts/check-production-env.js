console.log('🔍 Production Environment Check');
console.log('================================');

// Check critical environment variables
const criticalVars = [
  'NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
  'NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME',
  'NEXT_PUBLIC_URL'
];

console.log('\n📋 Critical Environment Variables:');
criticalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
  }
});

// Check optional Redis variables
const redisVars = [
  'REDIS_URL',
  'REDIS_TOKEN'
];

console.log('\n📋 Optional Redis Variables (for notifications):');
redisVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Not set (notifications will be disabled)`);
  }
});

console.log('\n💡 Next Steps:');
console.log('1. If any critical variables are missing, add them to Vercel Environment Variables');
console.log('2. Redeploy your app after adding the variables');
console.log('3. Redis variables are optional - only needed for notifications');

// Test contract address format
const contractAddress = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS;
if (contractAddress) {
  if (contractAddress === '0x0000000000000000000000000000000000000000') {
    console.log('\n🚨 WARNING: Contract address is set to zero address!');
    console.log('   This will cause all contract calls to fail.');
  } else if (contractAddress.startsWith('0x') && contractAddress.length === 42) {
    console.log('\n✅ Contract address format is valid');
  } else {
    console.log('\n⚠️  Contract address format may be invalid');
  }
} 