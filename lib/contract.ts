import { createPublicClient, http, parseAbi, type WalletClient } from 'viem';
import { baseSepolia } from 'viem/chains';

// FundBase Contract ABI
export const FUNDBASE_ABI = parseAbi([
  'function postIdea(string id, string title, string description) external',
  'function backIdeaWithETH(string id) external payable',
  'function backIdeaWithToken(string id, address token, uint256 amount) external',
  'function withdrawFunds(string id) external',
  'function getIdea(string id) external view returns (string, string, string, address, uint256, uint256, uint256, bool)',
  'function getBackers(string id) external view returns ((address, address, uint256, uint256)[])',
  'function getAllIdeas() external view returns ((string, string, string, address, uint256, uint256, uint256, bool)[])',
  'function getIdeaCount() external view returns (uint256)',
  'function hasUserBacked(string id, address user) external view returns (bool)',
  'function getTokenBalance(string id, address token) external view returns (uint256)',
  'function getAllTokenBalances(string id) external view returns ((address, uint256)[])',
  'event IdeaPosted(string indexed id, string title, address creator)',
  'event IdeaBacked(string indexed id, address backer, address token, uint256 amount)',
  'event FundsWithdrawn(string indexed id, address creator, address token, uint256 amount)',
]);

// Token addresses on Base
export const TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  ZORA: '0x0000000000000000000000000000000000000000', // Replace with actual ZORA address
} as const;

// Contract address (will be set after deployment)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS as `0x${string}`;

// Create public client for Base Sepolia
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Contract interaction functions
export async function postIdea(
  id: string,
  title: string,
  description: string,
  walletClient: WalletClient
) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'postIdea',
    args: [id, title, description],
    account: walletClient.account,
  });

  return walletClient.writeContract(request);
}

export async function backIdeaWithETH(
  id: string,
  amount: bigint,
  walletClient: WalletClient
) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'backIdeaWithETH',
    args: [id],
    value: amount,
    account: walletClient.account,
  });

  return walletClient.writeContract(request);
}

export async function backIdeaWithToken(
  id: string,
  token: `0x${string}`,
  amount: bigint,
  walletClient: WalletClient
) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'backIdeaWithToken',
    args: [id, token, amount],
    account: walletClient.account,
  });

  return walletClient.writeContract(request);
}

export async function withdrawFunds(
  id: string,
  walletClient: WalletClient
) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'withdrawFunds',
    args: [id],
    account: walletClient.account,
  });

  return walletClient.writeContract(request);
}

export async function getIdea(id: string) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'getIdea',
    args: [id],
  });
}

export async function getBackers(id: string) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'getBackers',
    args: [id],
  });
}

export async function getAllIdeas() {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'getAllIdeas',
  });
}

export async function hasUserBacked(id: string, user: `0x${string}`) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'hasUserBacked',
    args: [id, user],
  });
}

export async function getTokenBalance(id: string, token: `0x${string}`) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'getTokenBalance',
    args: [id, token],
  });
}

export async function getAllTokenBalances(id: string) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'getAllTokenBalances',
    args: [id],
  });
} 