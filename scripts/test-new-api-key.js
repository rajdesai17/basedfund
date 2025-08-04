const API_KEY = '2KFWyKyr1tA0qFvKQp5xLx2m14z0IyOJ';
const RPC_URL = `https://api.developer.coinbase.com/rpc/v1/base/${API_KEY}`;

async function testApiKey() {
  console.log('🧪 Testing new Coinbase Developer Platform API key...');
  console.log(`📡 RPC URL: ${RPC_URL}`);
  
  try {
    const response = await fetch(RPC_URL, {
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
      console.error('❌ API Error:', data.error);
      return false;
    }

    console.log('✅ API Key Test Successful!');
    console.log('📊 Response:', data);
    console.log('🔢 Block Number:', parseInt(data.result, 16));
    return true;

  } catch (error) {
    console.error('❌ API Key Test Failed:', error.message);
    return false;
  }
}

// Run the test
testApiKey().then(success => {
  if (success) {
    console.log('\n🎉 Your new API key is working correctly!');
    console.log('💡 You can now restart your development server: npm run dev');
  } else {
    console.log('\n⚠️ API key test failed. Please check your configuration.');
  }
}); 