const { createPublicClient, http } = require("viem");
const { base } = require("wagmi/chains");
require('dotenv').config();

// Test gas estimation and RPC connectivity
async function testGasEstimation() {
  console.log("🔍 Testing Gas Estimation and RPC Connectivity...\n");

  // Test RPC endpoints
  const rpcEndpoints = [
    'https://mainnet.base.org',
    'https://base.blockpi.network/v1/rpc/public',
    'https://1rpc.io/base',
    'https://base.meowrpc.com',
    'https://base.drpc.org',
    'https://base-mainnet.public.blastapi.io',
    'https://base.publicnode.com',
  ];

  for (const rpcUrl of rpcEndpoints) {
    console.log(`\n📡 Testing RPC: ${rpcUrl}`);
    
    try {
      const client = createPublicClient({
        chain: base,
        transport: http(rpcUrl, {
          timeout: 10000,
        }),
      });

      // Test 1: Get latest block
      console.log("  • Testing block retrieval...");
      const blockNumber = await client.getBlockNumber();
      console.log(`    ✅ Latest block: ${blockNumber}`);

      // Test 2: Get gas price
      console.log("  • Testing gas price retrieval...");
      const gasPrice = await client.getGasPrice();
      console.log(`    ✅ Gas price: ${gasPrice} wei`);

      // Test 3: Get base fee using direct RPC call
      console.log("  • Testing base fee retrieval...");
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: ['latest', false],
            id: 1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const baseFee = data.result.baseFeePerGas;
          if (baseFee) {
            console.log(`    ✅ Base fee: ${baseFee} wei`);
          } else {
            console.log(`    ⚠️ Base fee not available`);
          }
        } else {
          console.log(`    ❌ Failed to get base fee: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`    ❌ Base fee retrieval failed: ${error.message}`);
      }

      // Test 4: Estimate gas for a simple transaction
      console.log("  • Testing gas estimation...");
      try {
        const estimatedGas = await client.estimateGas({
          account: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          value: 0n,
        });
        console.log(`    ✅ Estimated gas: ${estimatedGas}`);
      } catch (error) {
        console.log(`    ⚠️ Gas estimation failed: ${error.message}`);
        console.log(`    💡 This is likely due to address checksum validation`);
      }

      console.log(`  🎉 RPC ${rpcUrl} is working properly!`);
      
      // If this RPC works well, we can use it as primary
      if (rpcUrl === 'https://mainnet.base.org') {
        console.log("  💡 This would be a good primary RPC endpoint");
      }
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
    }
  }

  console.log("\n🔍 Testing Contract Interaction...");
  
  // Test contract interaction
  const contractAddress = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.log("❌ Contract address not configured");
    return;
  }

  console.log(`📋 Contract address: ${contractAddress}`);

  try {
    const client = createPublicClient({
      chain: base,
      transport: http('https://mainnet.base.org'),
    });

    // Test contract read
    console.log("  • Testing contract read...");
    const result = await client.readContract({
      address: contractAddress,
      abi: [
        {
          inputs: [],
          name: "getAllIdeas",
          outputs: [
            {
              components: [
                { name: "id", type: "string" },
                { name: "title", type: "string" },
                { name: "description", type: "string" },
                { name: "creator", type: "address" },
                { name: "totalRaisedETH", type: "uint256" },
                { name: "backerCount", type: "uint256" },
                { name: "createdAt", type: "uint256" },
              ],
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "getAllIdeas",
    });
    
    console.log(`    ✅ Contract read successful, found ${result.length} ideas`);
    
  } catch (error) {
    console.log(`  ❌ Contract read failed: ${error.message}`);
  }

  console.log("\n🔍 Testing Gas Price Calculation...");
  
  try {
    const response = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const baseFee = BigInt(data.result.baseFeePerGas || '0');
      const maxPriorityFeePerGas = BigInt(1000000000); // 1 gwei
      const maxFeePerGas = baseFee * BigInt(2) + maxPriorityFeePerGas;

      console.log(`  ✅ Base fee: ${baseFee} wei`);
      console.log(`  ✅ Max priority fee: ${maxPriorityFeePerGas} wei`);
      console.log(`  ✅ Max fee per gas: ${maxFeePerGas} wei`);
      console.log(`  ✅ Estimated total cost for 100k gas: ${(maxFeePerGas * BigInt(100000)) / BigInt(1e18)} ETH`);
    } else {
      console.log(`  ❌ Failed to get gas prices: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Gas price calculation failed: ${error.message}`);
  }

  console.log("\n📋 Summary of Issues and Solutions:");
  console.log("1. If RPC endpoints are failing:");
  console.log("   • Check internet connection");
  console.log("   • Try different RPC endpoints");
  console.log("   • Consider using a paid RPC service");
  
  console.log("\n2. If gas estimation is failing:");
  console.log("   • Network may be congested");
  console.log("   • Try again in a few minutes");
  console.log("   • Use manual gas limits");
  
  console.log("\n3. If contract interaction is failing:");
  console.log("   • Verify contract address is correct");
  console.log("   • Check if contract is deployed");
  console.log("   • Ensure wallet has sufficient balance");
  
  console.log("\n4. For transaction preview issues:");
  console.log("   • Clear browser cache");
  console.log("   • Disconnect and reconnect wallet");
  console.log("   • Try a different browser");
  console.log("   • Check wallet extension permissions");
}

// Run the test
testGasEstimation().catch(console.error); 