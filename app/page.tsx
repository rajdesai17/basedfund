"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
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
  Button, 
  Icon, 
  Card,
  PostIdea,
  IdeaCard,
  BackersModal,
  type Idea,
  type Backer
} from "./components/FundBaseComponents";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: "1",
      title: "AI-Powered Coffee Maker",
      description: "A coffee maker that learns your preferences and brews the perfect cup every time using machine learning.",
      creator: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      totalRaised: BigInt(0.5 * 1e18),
      backerCount: 3,
      createdAt: Date.now() - 86400000,
    },
    {
      id: "2", 
      title: "Decentralized Social Network",
      description: "A social platform where users own their data and earn tokens for creating valuable content.",
      creator: "0x8ba1f109551bD432803012645Hac136c772c3c",
      totalRaised: BigInt(1.2 * 1e18),
      backerCount: 7,
      createdAt: Date.now() - 172800000,
    },
    {
      id: "3",
      title: "NFT-Powered Education Platform",
      description: "Learn skills, earn NFTs as certificates, and trade them on a marketplace. Education meets Web3.",
      creator: "0x1234567890123456789012345678901234567890",
      totalRaised: BigInt(0.3 * 1e18),
      backerCount: 2,
      createdAt: Date.now() - 43200000,
    },
  ]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [backers, setBackers] = useState<Backer[]>([]);
  const [showBackersModal, setShowBackersModal] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const sendNotification = useNotification();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleIdeaPosted = useCallback((newIdea: Idea) => {
    setIdeas(prev => [newIdea, ...prev]);
  }, []);

  const handleBackIdea = useCallback((ideaId: string, amount: bigint) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          totalRaised: idea.totalRaised + amount,
          backerCount: idea.backerCount + 1,
        };
      }
      return idea;
    }));
  }, []);

  const handleViewBackers = useCallback((ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setSelectedIdea(idea);
      
      // Generate realistic backer data based on the idea
      const backerData: { [key: string]: Backer[] } = {
        "1": [
          {
            wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            amount: BigInt(0.2 * 1e18),
            timestamp: Date.now() - 86400000,
          },
          {
            wallet: "0x8ba1f109551bD432803012645Hac136c772c3c",
            amount: BigInt(0.15 * 1e18),
            timestamp: Date.now() - 43200000,
          },
          {
            wallet: "0x1234567890123456789012345678901234567890",
            amount: BigInt(0.15 * 1e18),
            timestamp: Date.now() - 21600000,
          },
        ],
        "2": [
          {
            wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            amount: BigInt(0.5 * 1e18),
            timestamp: Date.now() - 172800000,
          },
          {
            wallet: "0x8ba1f109551bD432803012645Hac136c772c3c",
            amount: BigInt(0.3 * 1e18),
            timestamp: Date.now() - 129600000,
          },
          {
            wallet: "0x1234567890123456789012345678901234567890",
            amount: BigInt(0.2 * 1e18),
            timestamp: Date.now() - 86400000,
          },
          {
            wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
            amount: BigInt(0.1 * 1e18),
            timestamp: Date.now() - 43200000,
          },
          {
            wallet: "0x9876543210987654321098765432109876543210",
            amount: BigInt(0.05 * 1e18),
            timestamp: Date.now() - 21600000,
          },
          {
            wallet: "0x5555555555555555555555555555555555555555",
            amount: BigInt(0.03 * 1e18),
            timestamp: Date.now() - 10800000,
          },
          {
            wallet: "0x6666666666666666666666666666666666666666",
            amount: BigInt(0.02 * 1e18),
            timestamp: Date.now() - 5400000,
          },
        ],
        "3": [
          {
            wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            amount: BigInt(0.2 * 1e18),
            timestamp: Date.now() - 43200000,
          },
          {
            wallet: "0x8ba1f109551bD432803012645Hac136c772c3c",
            amount: BigInt(0.1 * 1e18),
            timestamp: Date.now() - 21600000,
          },
        ],
      };
      
      setBackers(backerData[ideaId] || []);
      setShowBackersModal(true);
    }
  }, [ideas]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Sort ideas by total raised (trending)
  const trendingIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => Number(b.totalRaised - a.totalRaised));
  }, [ideas]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
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
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-4 bg-[var(--app-card-bg)] rounded-lg p-1">
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "trending"
                  ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              <Icon name="trending" size="sm" className="inline mr-1" />
              Trending
            </button>
            <button
              onClick={() => setActiveTab("post")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "post"
                  ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              <Icon name="plus" size="sm" className="inline mr-1" />
              Post Idea
            </button>
          </div>

          {/* Content */}
          {activeTab === "trending" && (
            <div className="space-y-4">
              {trendingIdeas.length === 0 ? (
                <Card title="Welcome to FundBase">
                  <div className="text-center space-y-4">
                    <Icon name="lightbulb" size="lg" className="mx-auto text-[var(--app-accent)]" />
                    <p className="text-[var(--app-foreground-muted)]">
                      No ideas posted yet. Be the first to share your startup idea!
                    </p>
                    <Button
                      onClick={() => setActiveTab("post")}
                      icon={<Icon name="plus" size="sm" />}
                    >
                      Post Your First Idea
                    </Button>
                  </div>
                </Card>
              ) : (
                trendingIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onBack={handleBackIdea}
                    onViewBackers={handleViewBackers}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "post" && (
            <PostIdea onIdeaPosted={handleIdeaPosted} />
          )}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
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
