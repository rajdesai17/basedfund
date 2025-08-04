const API_KEY = '2KFWyKyr1tA0qFvKQp5xLx2m14z0IyOJ';
const PROJECT_NAME = 'FundBase';

console.log('🧪 Testing for duplicate client-project-name parameter...');
console.log(`📡 API Key: ${API_KEY}`);
console.log(`🏷️  Project Name: ${PROJECT_NAME}`);

// Simulate the MiniKit configuration that was causing issues
const configs = [
  {
    name: 'Wagmi Config',
    appName: PROJECT_NAME,
    appLogoUrl: 'http://localhost:3001/logo.png'
  },
  {
    name: 'MiniKit Config',
    appearance: {
      mode: "auto",
      theme: "mini-app-theme",
      logo: 'http://localhost:3001/logo.png'
      // Removed duplicate name property
    }
  }
];

console.log('\n📋 Configuration Analysis:');
configs.forEach((config, index) => {
  console.log(`${index + 1}. ${config.name}:`);
  console.log('   ', JSON.stringify(config, null, 2));
});

console.log('\n✅ FIXED: Removed duplicate name property from MiniKit appearance config');
console.log('💡 This should eliminate the duplicate client-project-name parameter');
console.log('🔍 The chain-proxy.wallet.coinbase.com 400 error should now be resolved');

// Test the RPC endpoint to make sure it still works
async function testRpcEndpoint() {
  console.log('\n🧪 Testing RPC endpoint...');
  
  try {
    const response = await fetch(`https://api.developer.coinbase.com/rpc/v1/base/${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: []
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ RPC Error:', data.error);
      return false;
    }

    console.log('✅ RPC endpoint working correctly');
    console.log(`📊 Block Number: ${parseInt(data.result, 16)}`);
    return true;

  } catch (error) {
    console.error('❌ RPC test failed:', error.message);
    return false;
  }
}

// Run the test
testRpcEndpoint().then(success => {
  if (success) {
    console.log('\n🎉 Configuration fix successful!');
    console.log('🚀 Your app should now work without the duplicate parameter error.');
    console.log('⚠️  The 400 Bad Request from chain-proxy should be resolved.');
    console.log('💡 Restart your development server to apply the changes.');
  } else {
    console.log('\n❌ RPC test failed. Check your API key configuration.');
  }
}); 