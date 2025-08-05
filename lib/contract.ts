import { createPublicClient, http, getContract, WalletClient, estimateGas } from "viem";
import { base } from "wagmi/chains";
import { FUNDBASE_ABI } from "./contract";
import { getCurrentGasPrices, handleRpcError } from "./wagmi-config";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

function getContractAddress(): `0x${string}` {
  const address = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("Contract address not configured");
  }
  return address as `0x${string}`;
}

// Enhanced gas estimation with fallback
async function estimateGasWithFallback(
  simulationRequest: {
    address: `0x${string}`;
    abi: typeof FUNDBASE_ABI;
    functionName: string;
    args: unknown[];
    account?: `0x${string}`;
    value?: bigint;
  }
): Promise<bigint> {
  try {
    // Try to get current gas prices for better estimation
    const gasPrices = await getCurrentGasPrices();
    
    if (gasPrices) {
      // Use current gas prices for estimation
    }
    
    // First attempt: standard simulation
    const { request } = await publicClient.simulateContract(simulationRequest as unknown as Parameters<typeof publicClient.simulateContract>[0]);
    return request.gas || BigInt(300000); // Default gas limit if estimation fails
  } catch (error) {
    // Fallback: use conservative gas estimate
    const fallbackGas = BigInt(500000); // Conservative estimate
    return fallbackGas;
  }
}

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

    // Validate wallet account
    if (!walletClient.account) {
      throw new Error("Wallet account is undefined");
    }

    // Enhanced gas estimation
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: 'postIdea',
      args: [id, title, description],
      account: walletClient.account.address,
    });

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "postIdea",
      args: [id, title, description],
      account: walletClient.account.address,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
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

    // Validate wallet account
    if (!walletClient.account) {
      throw new Error("Wallet account is undefined");
    }

    // Enhanced gas estimation for payable function
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: 'backIdeaWithETH',
      args: [id],
      account: walletClient.account.address,
      value: amount,
    });

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "backIdeaWithETH",
      args: [id],
      value: amount,
      account: walletClient.account.address,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
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

    // Validate wallet account
    if (!walletClient.account) {
      throw new Error("Wallet account is undefined");
    }

    // Enhanced gas estimation
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: 'backIdeaWithToken',
      args: [id, token, amount],
      account: walletClient.account.address,
    });

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "backIdeaWithToken",
      args: [id, token, amount],
      account: walletClient.account.address,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
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

    // Validate wallet account
    if (!walletClient.account) {
      throw new Error("Wallet account is undefined");
    }

    // Enhanced gas estimation
    const gas = await estimateGasWithFallback({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: 'withdrawFunds',
      args: [id],
      account: walletClient.account.address,
    });

    const { request } = await publicClient.simulateContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      functionName: "withdrawFunds",
      args: [id],
      account: walletClient.account.address,
      gas, // Use estimated gas
    });

    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    handleRpcError(error, "withdrawFunds");
    throw error;
  }
}

// Read functions
export async function getIdea(id: string) {
  try {
    const contract = getContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      publicClient,
    });

    return await contract.read.getIdea([id]);
  } catch (error) {
    handleRpcError(error, "getIdea");
    throw error;
  }
}

export async function getBackers(id: string) {
  try {
    const contract = getContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      publicClient,
    });

    return await contract.read.getBackers([id]);
  } catch (error) {
    handleRpcError(error, "getBackers");
    throw error;
  }
}

export async function getAllIdeas() {
  try {
    const contract = getContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      publicClient,
    });

    return await contract.read.getAllIdeas();
  } catch (error) {
    handleRpcError(error, "getAllIdeas");
    throw error;
  }
}

export async function hasUserBacked(id: string, user: `0x${string}`) {
  try {
    const contract = getContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      publicClient,
    });

    return await contract.read.hasUserBacked([id, user]);
  } catch (error) {
    handleRpcError(error, "hasUserBacked");
    throw error;
  }
}

export async function getTokenBalance(id: string, token: `0x${string}`) {
  try {
    const contract = getContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      publicClient,
    });

    return await contract.read.getTokenBalance([id, token]);
  } catch (error) {
    handleRpcError(error, "getTokenBalance");
    throw error;
  }
}

export async function getAllTokenBalances(id: string) {
  try {
    const contract = getContract({
      address: getContractAddress(),
      abi: FUNDBASE_ABI,
      publicClient,
    });

    return await contract.read.getAllTokenBalances([id]);
  } catch (error) {
    handleRpcError(error, "getAllTokenBalances");
    throw error;
  }
} 