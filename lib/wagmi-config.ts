import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export function createWagmiConfig(chain = base) {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'FundBase';
  const iconUrl = process.env.NEXT_PUBLIC_ICON_URL;

  // Multiple RPC URLs with fallbacks
  const rpcUrls = [
    // Primary: Coinbase RPC (if API key is valid)
    ...(apiKey && validateApiKey(apiKey) 
      ? [`https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`] 
      : []),
    // Fallback RPC URLs (public endpoints)
    'https://mainnet.base.org',
    'https://base.blockpi.network/v1/rpc/public',
    'https://1rpc.io/base',
    'https://base.meowrpc.com',
    'https://base.drpc.org',
  ];

  console.log("🔧 Creating Wagmi Config:", {
    chain: chain.name,
    chainId: chain.id,
    primaryRpc: rpcUrls[0] || 'No valid RPC configured',
    fallbackRpcCount: rpcUrls.length - 1,
    hasValidApiKey: validateApiKey(apiKey),
    totalRpcUrls: rpcUrls.length,
  });

  // Create transport with primary RPC endpoint
  const transport = http(rpcUrls[0], {
    batch: {
      batchSize: 1024,
      wait: 16,
    },
    retryCount: 3,
    retryDelay: 1000,
    timeout: 15000, // 15 second timeout
  });

  return createConfig({
    chains: [chain],
    connectors: [
      coinbaseWallet({
        // Removed appName to prevent duplicate client-project-name parameter
        // MiniKitProvider handles the project name configuration
        appLogoUrl: iconUrl,
      }),
    ],
    transports: {
      [chain.id]: transport,
    },
    pollingInterval: 4000,
  });
}

// Error handling utility
export function handleRpcError(error: unknown, context: string) {
  console.error(`RPC Error in ${context}:`, error);
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check if it's a 401/400 error
  if (errorMessage.includes('401') || errorMessage.includes('400')) {
    console.warn(`Coinbase API error detected in ${context}. This may be due to API key permissions or rate limiting.`);
    console.warn(`💡 Tip: Check your NEXT_PUBLIC_ONCHAINKIT_API_KEY in .env file`);
  }
  
  // Check if it's a network error
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    console.warn(`Network error detected in ${context}. Check your internet connection.`);
  }

  // Check if it's a timeout error
  if (errorMessage.includes('timeout')) {
    console.warn(`Timeout error detected in ${context}. RPC endpoint may be slow.`);
  }
}

// RPC health check utility
export async function checkRpcHealth(rpcUrl: string): Promise<boolean> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error(`RPC health check failed for ${rpcUrl}:`, error);
    return false;
  }
}

// Validate API key format
export function validateApiKey(apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  
  // Check for placeholder values
  const placeholders = [
    'your_actual_coinbase_api_key_here',
    'REPLACE_WITH_YOUR_API_KEY',
    'YOUR_API_KEY_HERE',
    'e0b99b06-e0dd-4cee-8a74-3ccef9d95d05' // Old placeholder
  ];
  
  if (placeholders.includes(apiKey)) {
    console.warn('⚠️ Using placeholder API key. Please replace with a real Coinbase Developer Platform API key.');
    return false;
  }
  
  // Check for valid Coinbase Developer Platform API key format
  // New format: alphanumeric string (e.g., 2KFWyKyr1tA0qFvKQp5xLx2m14z0IyOJ)
  // Old format: UUID (e.g., e0b99b06-e0dd-4cee-8a74-3ccef9d95d05)
  const newFormatRegex = /^[A-Za-z0-9]{20,}$/; // Alphanumeric, at least 20 chars
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  return newFormatRegex.test(apiKey) || uuidRegex.test(apiKey);
} 