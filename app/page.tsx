"use client";

import {
  useMiniKit,
  useAddFrame,
  useNotification,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { 
  Icon, 
  PostIdea,
  IdeaCard,
  BackersModal,
  type Idea,
  type Backer
} from "./components/FundBaseComponents";
import { getAllIdeas } from "../lib/contract";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [backers, setBackers] = useState<Backer[]>([]);
  const [showBackersModal, setShowBackersModal] = useState(false);

  const addFrame = useAddFrame();
  const sendNotification = useNotification();

  // Load ideas from blockchain
  const loadIdeasFromContract = useCallback(async () => {
    try {
      setIsLoadingIdeas(true);
      
      // Debug: Check if wallet is connected
      console.log("Wallet context:", context);
      console.log("Contract address:", process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS);
      
      // Check if wallet is connected
      if (!context?.client?.account) {
        console.log("Wallet not connected, but trying to read contract anyway...");
      }
      
      const contractIdeas = await getAllIdeas();
      
      console.log("Contract ideas result:", contractIdeas);
      
      // Check if we got valid data
      if (!contractIdeas || contractIdeas.length === 0) {
        console.log("No ideas found in contract");
        setIdeas([]);
        return;
      }
      
      // Transform contract data to match our Idea type
      const transformedIdeas: Idea[] = contractIdeas
        .filter((idea: unknown) => {
          const ideaArray = idea as unknown[];
          return ideaArray && ideaArray[0] && ideaArray[1] && ideaArray[2] && ideaArray[7];
        }) // Filter out empty ideas and ensure exists is true
        .map((idea: unknown) => {
          const ideaArray = idea as unknown[];
          return {
            id: ideaArray[0] as string, // id
            title: ideaArray[1] as string, // title
            description: ideaArray[2] as string, // description
            creator: ideaArray[3] as string, // creator
            totalRaisedETH: ideaArray[4] as bigint, // totalRaisedETH
            backerCount: ideaArray[5] as number, // backerCount
            createdAt: Number(ideaArray[6]) * 1000, // createdAt (convert from seconds to milliseconds)
          };
        });
      
      console.log("Transformed ideas:", transformedIdeas);
      setIdeas(transformedIdeas);
    } catch (error) {
      console.error("Failed to load ideas from contract:", error);
      // Keep empty array if loading fails
      setIdeas([]);
    } finally {
      setIsLoadingIdeas(false);
    }
  }, []);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Load ideas from blockchain when component mounts
  useEffect(() => {
    // Add a small delay to ensure wallet is ready
    const timer = setTimeout(() => {
      loadIdeasFromContract();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [loadIdeasFromContract]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleIdeaPosted = useCallback((newIdea: Idea) => {
    // Reload all ideas from blockchain to get the latest data
    loadIdeasFromContract();
    sendNotification({
      title: "Idea Posted! 🚀",
      body: `Your idea "${newIdea.title}" has been posted successfully!`,
    });
  }, [loadIdeasFromContract, sendNotification]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBackIdea = useCallback((_ideaId: string, _token: string, _amount: bigint) => {
    // Reload all ideas from blockchain to get the latest data
    loadIdeasFromContract();
  }, [loadIdeasFromContract]);

  const handleViewBackers = useCallback((ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setSelectedIdea(idea);
      
      // Generate realistic backer data with multiple tokens
      const backerData: { [key: string]: Backer[] } = {
        "1": [
          {
            wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(2.5 * 1e18),
            timestamp: Date.now() - 86400000,
          },
          {
            wallet: "0x8ba1f109551bD432803012645Hac136c772c3c",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(1500 * 1e6),
            timestamp: Date.now() - 43200000,
          },
          {
            wallet: "0x1234567890123456789012345678901234567890",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(1.8 * 1e18),
            timestamp: Date.now() - 21600000,
          },
          {
            wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(800 * 1e6),
            timestamp: Date.now() - 10800000,
          },
          {
            wallet: "0x9876543210987654321098765432109876543210",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(3.2 * 1e18),
            timestamp: Date.now() - 5400000,
          },
        ],
        "2": [
          {
            wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(2.1 * 1e18),
            timestamp: Date.now() - 172800000,
          },
          {
            wallet: "0x8ba1f109551bD432803012645Hac136c772c3c",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(1200 * 1e6),
            timestamp: Date.now() - 129600000,
          },
          {
            wallet: "0x1234567890123456789012345678901234567890",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(1.5 * 1e18),
            timestamp: Date.now() - 86400000,
          },
          {
            wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(900 * 1e6),
            timestamp: Date.now() - 43200000,
          },
          {
            wallet: "0x9876543210987654321098765432109876543210",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(1.2 * 1e18),
            timestamp: Date.now() - 21600000,
          },
          {
            wallet: "0x5555555555555555555555555555555555555555",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(600 * 1e6),
            timestamp: Date.now() - 10800000,
          },
          {
            wallet: "0x6666666666666666666666666666666666666666",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(0.7 * 1e18),
            timestamp: Date.now() - 5400000,
          },
        ],
        "3": [
          {
            wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(4.2 * 1e18),
            timestamp: Date.now() - 43200000,
          },
          {
            wallet: "0x8ba1f109551bD432803012645Hac136c772c3c",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(2500 * 1e6),
            timestamp: Date.now() - 21600000,
          },
          {
            wallet: "0x1234567890123456789012345678901234567890",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(3.8 * 1e18),
            timestamp: Date.now() - 10800000,
          },
          {
            wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
            token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
            amount: BigInt(1800 * 1e6),
            timestamp: Date.now() - 5400000,
          },
          {
            wallet: "0x9876543210987654321098765432109876543210",
            token: "0x0000000000000000000000000000000000000000", // ETH
            amount: BigInt(2.4 * 1e18),
            timestamp: Date.now() - 2700000,
          },
        ],
      };
      
      setBackers(backerData[ideaId] || []);
      setShowBackersModal(true);
    }
  }, [ideas]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWithdrawFunds = useCallback((_ideaId: string) => {
    // Reload all ideas from blockchain to get the latest data
    loadIdeasFromContract();

    sendNotification({
      title: "Funds Withdrawn! 💰",
      body: "Funds have been successfully withdrawn to your wallet.",
    });
  }, [loadIdeasFromContract, sendNotification]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <div
          onClick={handleAddFrame}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 text-blue-600 cursor-pointer"
        >
          <Icon name="plus" size="sm" />
          Save Frame
        </div>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-green-600 animate-fade-out">
          <Icon name="check" size="sm" className="text-green-600" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Sort ideas by total raised (trending)
  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => Number(b.totalRaisedETH - a.totalRaisedETH));
  }, [ideas]);

  const totalFunding = useMemo(() => {
    return ideas.reduce((total, idea) => total + Number(idea.totalRaisedETH) / 1e18, 0);
  }, [ideas]);

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded"></div>
          <h1 className="text-lg font-medium text-gray-900">FundBase</h1>
          <span className="text-sm text-gray-500">• Professional Platform</span>
        </div>

        <div className="flex items-center space-x-3">
          <Wallet className="z-10">
            <ConnectWallet>
              <div className="wallet-connect-button">
                <Name className="text-inherit" />
              </div>
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
          {saveFrameButton}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Post New Idea */}
        <div className="w-80 border-r border-gray-200 p-6">
          <PostIdea onIdeaPosted={handleIdeaPosted} />
        </div>

        {/* Right Panel - Project Registry */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-medium text-gray-900">Project Registry</h2>
              <p className="text-sm text-gray-600 mt-1">
                {ideas.length} projects • {totalFunding.toFixed(1)} ETH total funding
              </p>
            </div>
            <div className="text-xs text-gray-500">Sorted by funding amount</div>
          </div>
          
          <div className="space-y-4">
            {isLoadingIdeas ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading ideas from blockchain...</p>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No ideas posted yet. Be the first to post an idea!</p>
              </div>
            ) : (
              sortedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onBack={handleBackIdea}
                  onViewBackers={handleViewBackers}
                  onWithdraw={handleWithdrawFunds}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Backers Modal */}
      <BackersModal
        idea={selectedIdea}
        backers={backers}
        isOpen={showBackersModal}
        onClose={() => setShowBackersModal(false)}
      />
    </div>
  );
}
