import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { createPublicClient } from "viem";

export function createWagmiConfig(chain = base) {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  const iconUrl = process.env.NEXT_PUBLIC_ICON_URL;

  // Enhanced RPC URLs with better fallbacks and gas estimation support
  const rpcUrls = [
    // Primary: Coinbase RPC (if API key is valid)
    ...(apiKey && validateApiKey(apiKey) 
      ? [`https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`] 
      : []),
    // Enhanced fallback RPC URLs with better gas estimation support
    'https://mainnet.base.org',
    'https://base.blockpi.network/v1/rpc/public',
    'https://1rpc.io/base',
    'https://base.meowrpc.com',
    'https://base.drpc.org',
    'https://base-mainnet.public.blastapi.io',
    'https://base.publicnode.com',
    'https://base-rpc.publicnode.com',
  ];

  console.log("🔧 Creating Enhanced Wagmi Config:", {
    chain: chain.name,
    chainId: chain.id,
    primaryRpc: rpcUrls[0] || 'No valid RPC configured',
    fallbackRpcCount: rpcUrls.length - 1,
    hasValidApiKey: validateApiKey(apiKey),
    totalRpcUrls: rpcUrls.length,
  });

  // Create transport with enhanced configuration for better gas estimation
  const transport = http(rpcUrls[0], {
    batch: {
      batchSize: 1024,
      wait: 16,
    },
    retryCount: 5, // Increased retry count
    retryDelay: 1000,
    timeout: 20000, // Increased timeout to 20 seconds
  });

  return createConfig({
    chains: [chain],
    connectors: [
      coinbaseWallet({
        // Completely removed appName to prevent any duplicate client-project-name parameter
        // The project name is handled by MiniKitProvider only
        appLogoUrl: iconUrl,
        // Force Base chain to prevent Ethereum mainnet connection
        chainId: chain.id,
      }),
    ],
    transports: {
      [chain.id]: transport,
    },
    pollingInterval: 4000,
    // Enhanced configuration for better transaction handling
    ssr: false, // Disable SSR to prevent hydration issues
  });
}

// Enhanced error handling utility with gas estimation specific errors
export function handleRpcError(error: unknown, context: string) {
  console.error(`RPC Error in ${context}:`, error);
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check for gas estimation errors
  if (errorMessage.includes('gas') || errorMessage.includes('fee') || errorMessage.includes('estimate')) {
    console.warn(`⚠️ Gas estimation error detected in ${context}. This indicates:`);
    console.warn('   • Network congestion causing high gas fees');
    console.warn('   • RPC endpoint issues with gas estimation');
    console.warn('   • Contract interaction problems');
    console.warn('💡 Solutions:');
    console.warn('   • Try again in a few minutes');
    console.warn('   • Check network status');
    console.warn('   • Ensure sufficient wallet balance');
    console.warn('   • Clear browser cache and retry');
  }
  
  // Check for 400 Bad Request errors (per Coinbase docs)
  if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
    console.warn(`⚠️ 400 Bad Request detected in ${context}. This indicates:`);
    console.warn('   • Invalid request parameters');
    console.warn('   • Missing required parameters');
    console.warn('   • Malformed request data');
    console.warn('   • Authentication issues');
    console.warn('💡 Solutions:');
    console.warn('   • Check wallet connection status');
    console.warn('   • Verify request format');
    console.warn('   • Ensure proper authentication');
    console.warn('   • Clear browser cache and retry');
  }
  
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

  // Check for wallet connection errors
  if (errorMessage.includes('wallet') || errorMessage.includes('connection')) {
    console.warn(`Wallet connection error detected in ${context}. Ensure wallet is properly connected.`);
  }

  // Check for transaction simulation errors
  if (errorMessage.includes('simulation') || errorMessage.includes('revert')) {
    console.warn(`Transaction simulation error detected in ${context}. This may indicate:`);
    console.warn('   • Insufficient balance');
    console.warn('   • Contract state issues');
    console.warn('   • Invalid transaction parameters');
  }
}

// Enhanced RPC health check utility with gas estimation test
export async function checkRpcHealth(rpcUrl: string): Promise<boolean> {
  try {
    // Test basic connectivity
    const blockResponse = await fetch(rpcUrl, {
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
    
    if (!blockResponse.ok) {
      console.error(`RPC health check failed for ${rpcUrl}: HTTP ${blockResponse.status}`);
      return false;
    }

    // Test gas estimation capability
    const gasResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_estimateGas',
        params: [{
          from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          value: '0x0',
        }],
        id: 2,
      }),
    });
    
    return gasResponse.ok;
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

// New utility function to get current gas prices
export async function getCurrentGasPrices(): Promise<{
  baseFee: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
} | null> {
  try {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const block = await publicClient.getBlock({ blockTag: 'latest' });
    
    if (!block.baseFeePerGas) {
      console.warn("⚠️ Base fee not available in block");
      return null;
    }

    const baseFee = block.baseFeePerGas;
    const maxPriorityFeePerGas = BigInt(1500000000); // 1.5 gwei
    const maxFeePerGas = baseFee + maxPriorityFeePerGas;

    return {
      baseFee,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  } catch (error) {
    console.error("❌ Failed to get current gas prices:", error);
    return null;
  }
}

// New function to check for auxiliary funds capability
export async function checkAuxiliaryFundsCapability(address: `0x${string}`): Promise<boolean> {
  try {
    // Check if the wallet supports auxiliary funds (MagicSpend)
    const provider = window.ethereum;
    if (!provider) {
      console.warn("⚠️ No Ethereum provider found");
      return false;
    }

    const capabilities = await provider.request({
      method: "wallet_getCapabilities",
      params: [address],
    });

    const hasAuxFunds = capabilities?.[8453]?.auxiliaryFunds?.supported ?? false;
    console.log("🔍 Auxiliary funds capability:", hasAuxFunds);
    return hasAuxFunds;
  } catch (error) {
    console.warn("⚠️ Could not check auxiliary funds capability:", error);
    return false;
  }
}

// New function to get total balance including auxiliary funds
export async function getTotalBalance(address: `0x${string}`): Promise<{
  onchainBalance: bigint;
  auxiliaryBalance: bigint;
  totalBalance: bigint;
  hasAuxiliaryFunds: boolean;
}> {
  try {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Get onchain balance
    const onchainBalance = await publicClient.getBalance({ address });
    
    // Check for auxiliary funds
    const hasAuxiliaryFunds = await checkAuxiliaryFundsCapability(address);
    let auxiliaryBalance = BigInt(0);

    if (hasAuxiliaryFunds) {
      try {
        // Try to get auxiliary balance from Coinbase
        const provider = window.ethereum;
        if (provider) {
          const auxiliaryData = await provider.request({
            method: "wallet_getAuxiliaryFunds",
            params: [address],
          });
          
          if (auxiliaryData?.balance) {
            auxiliaryBalance = BigInt(auxiliaryData.balance);
          }
        }
      } catch (error) {
        console.warn("⚠️ Could not get auxiliary balance:", error);
      }
    }

    const totalBalance = onchainBalance + auxiliaryBalance;

    console.log("💰 Balance breakdown:", {
      onchain: onchainBalance.toString(),
      auxiliary: auxiliaryBalance.toString(),
      total: totalBalance.toString(),
      hasAuxiliaryFunds,
    });

    return {
      onchainBalance,
      auxiliaryBalance,
      totalBalance,
      hasAuxiliaryFunds,
    };
  } catch (error) {
    console.error("❌ Failed to get total balance:", error);
    return {
      onchainBalance: BigInt(0),
      auxiliaryBalance: BigInt(0),
      totalBalance: BigInt(0),
      hasAuxiliaryFunds: false,
    };
  }
} 