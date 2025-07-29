import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

// FundBase Contract ABI
export const FUNDBASE_ABI = parseAbi([
  'function postIdea(string id, string title, string description) external',
  'function backIdea(string id) external payable',
  'function withdrawFunds(string id) external',
  'function getIdea(string id) external view returns (string, string, string, address, uint256, uint256, uint256, bool)',
  'function getBackers(string id) external view returns ((address, uint256, uint256)[])',
  'function getAllIdeas() external view returns ((string, string, string, address, uint256, uint256, uint256, bool)[])',
  'function getIdeaCount() external view returns (uint256)',
  'function hasUserBacked(string id, address user) external view returns (bool)',
  'event IdeaPosted(string indexed id, string title, address creator)',
  'event IdeaBacked(string indexed id, address backer, uint256 amount)',
  'event FundsWithdrawn(string indexed id, address creator, uint256 amount)',
]);

// Contract address (will be set after deployment)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS as `0x${string}`;

// Create public client for Base
export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Contract interaction functions
export async function postIdea(
  id: string,
  title: string,
  description: string,
  walletClient: any
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

export async function backIdea(
  id: string,
  amount: bigint,
  walletClient: any
) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: FUNDBASE_ABI,
    functionName: 'backIdea',
    args: [id],
    value: amount,
    account: walletClient.account,
  });

  return walletClient.writeContract(request);
}

export async function withdrawFunds(
  id: string,
  walletClient: any
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