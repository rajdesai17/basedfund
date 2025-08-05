import { createPublicClient, http, type WalletClient } from "viem";
import { base } from "wagmi/chains";
import { handleRpcError, getCurrentGasPrices } from "./wagmi-config";

// FundBase contract ABI
export const FUNDBASE_ABI = [
  {
    inputs: [
      { name: "id", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
    ],
    name: "postIdea",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "string" }],
    name: "backIdeaWithETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "id", type: "string" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "backIdeaWithToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "string" }],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "string" }],
    name: "getIdea",
    outputs: [
      { name: "id", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "creator", type: "address" },
      { name: "totalRaisedETH", type: "uint256" },
      { name: "backerCount", type: "uint256" },
      { name: "createdAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "string" }],
    name: "getBackers",
    outputs: [
      {
        components: [
          { name: "backer", type: "address" },
          { name: "token", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "timestamp", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
  {
    inputs: [{ name: "id", type: "string" }],
    name: "getIdeaCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "id", type: "string" },
      { name: "user", type: "address" },
    ],
    name: "hasUserBacked",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "id", type: "string" },
      { name: "token", type: "address" },
    ],
    name: "getTokenBalance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "string" }],
    name: "getAllTokenBalances",
    outputs: [
      {
        components: [
          { name: "token", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Token addresses
export const TOKENS = {
  ETH: "0x0000000000000000000000000000000000000000",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  ZORA: "0x0000000000000000000000000000000000000000",
} as const;

// Create public client with proper error handling
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Helper function to get contract address with validation
function getContractAddress(): `0x${string}` {
  const contractAddress = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address not configured");
  }
  return contractAddress as `0x${string}`;
}

// Enhanced gas estimation with fallback
async function estimateGasWithFallback(
  simulationRequest: any,
  walletClient: WalletClient
): Promise<bigint> {
  try {
    // Try to get current gas prices for better estimation
    const gasPrices = await getCurrentGasPrices();
    
    if (gasPrices) {
      console.log("📊 Current gas prices:", {
        baseFee: gasPrices.baseFee.toString(),
        maxFeePerGas: gasPrices.maxFeePerGas.toString(),
        maxPriorityFeePerGas: gasPrices.maxPriorityFeePerGas.toString(),
      });
    }

    // First attempt: standard simulation
    const { request } = await publicClient.simulateContract(simulationRequest);
    return request.gas || BigInt(300000); // Default gas limit if estimation fails
  } catch (error) {
    console.warn("⚠️ Gas estimation failed, using fallback:", error);
    
    // Fallback: use conservative gas estimate
    const fallbackGas = BigInt(500000); // Conservative estimate
    console.log("🔄 Using fallback gas estimate:", fallbackGas.toString());
    return fallbackGas;
  }
}

// Enhanced contract interaction with proper validation and gas estimation
export async function postIdea(
  id: string,
  title: string,
  description: string,
  walletClient: WalletClient
) {
  try {
    // Validate input parameters
    if (!id || !title || !description) {
      throw new Error("Missing required parameters: id, title, description");
    }

    console.log("📝 Posting idea with validated parameters:", { id, title, description });

    // Enhanced gas estimation
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "postIdea",
      args: [id, title, description],
      account: walletClient.account,
    }, walletClient);

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "postIdea",
      args: [id, title, description],
      account: walletClient.account,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
    console.log("✅ Idea posted successfully:", hash);
    return hash;
  } catch (error) {
    handleRpcError(error, "postIdea");
    throw error;
  }
}

export async function backIdeaWithETH(
  id: string,
  amount: bigint,
  walletClient: WalletClient
) {
  try {
    // Validate input parameters
    if (!id || amount <= 0n) {
      throw new Error("Missing required parameters: id, amount");
    }

    console.log("💰 Backing idea with ETH:", { id, amount });

    // Enhanced gas estimation for payable function
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "backIdeaWithETH",
      args: [id],
      value: amount,
      account: walletClient.account,
    }, walletClient);

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "backIdeaWithETH",
      args: [id],
      value: amount,
      account: walletClient.account,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
    console.log("✅ Idea backed successfully:", hash);
    return hash;
  } catch (error) {
    handleRpcError(error, "backIdeaWithETH");
    throw error;
  }
}

export async function backIdeaWithToken(
  id: string,
  token: `0x${string}`,
  amount: bigint,
  walletClient: WalletClient
) {
  try {
    // Validate input parameters
    if (!id || !token || amount <= 0n) {
      throw new Error("Missing required parameters: id, token, amount");
    }

    console.log("💰 Backing idea with token:", { id, token, amount });

    // Enhanced gas estimation
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "backIdeaWithToken",
      args: [id, token, amount],
      account: walletClient.account,
    }, walletClient);

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "backIdeaWithToken",
      args: [id, token, amount],
      account: walletClient.account,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
    console.log("✅ Idea backed with token successfully:", hash);
    return hash;
  } catch (error) {
    handleRpcError(error, "backIdeaWithToken");
    throw error;
  }
}

export async function withdrawFunds(
  id: string,
  walletClient: WalletClient
) {
  try {
    // Validate input parameters
    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    console.log("💸 Withdrawing funds for idea:", { id });

    // Enhanced gas estimation
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "withdrawFunds",
      args: [id],
      account: walletClient.account,
    }, walletClient);

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "withdrawFunds",
      args: [id],
      account: walletClient.account,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
    console.log("✅ Funds withdrawn successfully:", hash);
    return hash;
  } catch (error) {
    handleRpcError(error, "withdrawFunds");
    throw error;
  }
}

export async function getIdea(id: string) {
  try {
    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    return await publicClient.readContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "getIdea",
      args: [id],
    });
  } catch (error) {
    handleRpcError(error, "getIdea");
    throw error;
  }
}

export async function getBackers(id: string) {
  try {
    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    return await publicClient.readContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "getBackers",
      args: [id],
    });
  } catch (error) {
    handleRpcError(error, "getBackers");
    throw error;
  }
}

export async function getAllIdeas() {
  try {
    return await publicClient.readContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "getAllIdeas",
    });
  } catch (error) {
    handleRpcError(error, "getAllIdeas");
    throw error;
  }
}

export async function hasUserBacked(id: string, user: `0x${string}`) {
  try {
    if (!id || !user) {
      throw new Error("Missing required parameters: id, user");
    }

    return await publicClient.readContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "hasUserBacked",
      args: [id, user],
    });
  } catch (error) {
    handleRpcError(error, "hasUserBacked");
    throw error;
  }
}

export async function getTokenBalance(id: string, token: `0x${string}`) {
  try {
    if (!id || !token) {
      throw new Error("Missing required parameters: id, token");
    }

    return await publicClient.readContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "getTokenBalance",
      args: [id, token],
    });
  } catch (error) {
    handleRpcError(error, "getTokenBalance");
    throw error;
  }
}

export async function getAllTokenBalances(id: string) {
  try {
    if (!id) {
      throw new Error("Missing required parameter: id");
    }

    return await publicClient.readContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "getAllTokenBalances",
      args: [id],
    });
  } catch (error) {
    handleRpcError(error, "getAllTokenBalances");
    throw error;
  }
} 