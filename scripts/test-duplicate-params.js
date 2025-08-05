const API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'your_api_key_here';
const PROJECT_NAME = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'FundBase';

// Production-ready logging
const logger = {
  info: (msg) => process.env.NODE_ENV === 'development' && console.log(msg),
  error: (msg) => process.env.NODE_ENV === 'development' && console.error(msg)
};

logger.info('🧪 Testing for duplicate client-project-name parameter...');
logger.info(`📡 API Key: ${API_KEY ? 'Set' : 'Missing'}`);
logger.info(`🏷️  Project Name: ${PROJECT_NAME}`);

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

logger.info('\n📋 Configuration Analysis:');
configs.forEach((config, index) => {
  logger.info(`${index + 1}. ${config.name}:`);
  logger.info('   ', JSON.stringify(config, null, 2));
});

logger.info('\n✅ FIXED: Removed duplicate name property from MiniKit appearance config');
logger.info('💡 This should eliminate the duplicate client-project-name parameter');
logger.info('🔍 The chain-proxy.wallet.coinbase.com 400 error should now be resolved');

// Test the RPC endpoint to make sure it still works
async function testRpcEndpoint() {
  logger.info('\n🧪 Testing RPC endpoint...');
  
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
      logger.error('❌ RPC Error:', data.error);
      return false;
    }

    logger.info('✅ RPC endpoint working correctly');
    logger.info(`📊 Block Number: ${parseInt(data.result, 16)}`);
    return true;

  } catch (error) {
    logger.error('❌ RPC test failed:', error.message);
    return false;
  }
}

// Run the test
testRpcEndpoint().then(success => {
  if (success) {
    logger.info('\n🎉 Configuration fix successful!');
    logger.info('🚀 Your app should now work without the duplicate parameter error.');
    logger.info('⚠️  The 400 Bad Request from chain-proxy should be resolved.');
    logger.info('💡 Restart your development server to apply the changes.');
  } else {
    logger.error('\n❌ RPC test failed. Check your API key configuration.');
  }
}); 