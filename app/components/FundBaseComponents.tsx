"use client";

import { type ReactNode, useState, useCallback, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { encodeFunctionData } from "viem";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { Name, Address, Avatar } from "@coinbase/onchainkit/identity";
import { FUNDBASE_ABI } from "@/lib/contract";

// Types
export type Idea = {
  id: string;
  title: string;
  description: string;
  creator: string;
  totalRaised: bigint;
  backerCount: number;
  createdAt: number;
};

export type Backer = {
  wallet: string;
  amount: bigint;
  timestamp: number;
};

// Button Component
type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Card Component
type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// Icon Component
type IconProps = {
  name: "plus" | "heart" | "users" | "trending" | "lightbulb" | "arrow-right" | "check";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    users: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Users</title>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2a4 4 0 0 0-4-4H16a4 4 0 0 0-4 4v2" />
        <circle cx="15" cy="7" r="4" />
      </svg>
    ),
    trending: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Trending</title>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    lightbulb: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Lightbulb</title>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15 2a6.5 6.5 0 0 1 6.5 6.5c0 3.5-2.5 6.5-6.5 6.5H9C5 15 2.5 12 2.5 8.5A6.5 6.5 0 0 1 9 2z" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}

// Post Idea Component
type PostIdeaProps = {
  onIdeaPosted: (idea: Idea) => void;
};

export function PostIdea({ onIdeaPosted }: PostIdeaProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { address } = useAccount();

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !description.trim() || !address) return;

    const newIdea: Idea = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      creator: address,
      totalRaised: BigInt(0),
      backerCount: 0,
      createdAt: Date.now(),
    };

    onIdeaPosted(newIdea);
    setTitle("");
    setDescription("");
  }, [title, description, address, onIdeaPosted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!address) {
    return (
      <Card title="Post Your Startup Idea">
        <p className="text-[var(--app-foreground-muted)] text-center">
          Connect your wallet to post an idea
        </p>
      </Card>
    );
  }

  return (
    <Card title="Post Your Startup Idea">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
            Idea Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., AI-powered coffee maker"
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your wild startup idea..."
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)] resize-none"
            rows={3}
            maxLength={500}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
          icon={<Icon name="lightbulb" size="sm" />}
          className="w-full"
        >
          Post Idea
        </Button>
      </div>
    </Card>
  );
}

// Idea Card Component
type IdeaCardProps = {
  idea: Idea;
  onBack: (ideaId: string, amount: bigint) => void;
  onViewBackers: (ideaId: string) => void;
};

export function IdeaCard({ idea, onBack, onViewBackers }: IdeaCardProps) {
  const [backAmount, setBackAmount] = useState("");
  const [showTransaction, setShowTransaction] = useState(false);
  const { address } = useAccount();
  const sendNotification = useNotification();

  const calls = useMemo(() => {
    if (!address || !backAmount) return [];

    const amount = BigInt(parseFloat(backAmount) * 1e18);
    
    return [
      {
        to: process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: FUNDBASE_ABI,
          functionName: 'backIdea',
          args: [idea.id],
        }),
        value: amount,
      },
    ];
  }, [address, backAmount, idea.id]);

  const handleTransactionSuccess = useCallback((response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;
    const amount = BigInt(parseFloat(backAmount) * 1e18);
    
    onBack(idea.id, amount);
    setBackAmount("");
    setShowTransaction(false);

    // Send notification
    sendNotification({
      title: "Idea Backed! 💰",
      body: `You backed "${idea.title}" with ${Number(amount) / 1e18} ETH!`,
    });

    console.log(`Transaction successful: ${transactionHash}`);
  }, [backAmount, idea.title, onBack, sendNotification]);

  const handleTransactionError = useCallback((error: TransactionError) => {
    console.error("Transaction failed:", error);
    setShowTransaction(false);
  }, []);

  const handleBack = useCallback(() => {
    if (!backAmount || !address) return;
    setShowTransaction(true);
  }, [backAmount, address]);

  const formatEth = (wei: bigint) => {
    return Number(wei) / 1e18;
  };

  return (
    <Card className="hover:scale-[1.02] transition-transform">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-2">
            {idea.title}
          </h3>
          <p className="text-[var(--app-foreground-muted)] text-sm mb-3">
            {idea.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Avatar address={idea.creator} />
            <Address address={idea.creator} />
          </div>
          <div className="text-right">
            <div className="font-medium text-[var(--app-foreground)]">
              {formatEth(idea.totalRaised)} ETH
            </div>
            <div className="text-[var(--app-foreground-muted)]">
              {idea.backerCount} backers
            </div>
          </div>
        </div>

        {!showTransaction ? (
          <div className="flex space-x-2">
            <input
              type="number"
              value={backAmount}
              onChange={(e) => setBackAmount(e.target.value)}
              placeholder="0.01"
              className="flex-1 px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              step="0.001"
              min="0"
            />
            <Button
              onClick={handleBack}
              disabled={!backAmount || !address}
              size="sm"
              icon={<Icon name="heart" size="sm" />}
            >
              Back
            </Button>
          </div>
        ) : (
          <Transaction
            calls={calls}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          >
            <TransactionButton className="w-full">
              Back with {backAmount} ETH
            </TransactionButton>
            <TransactionStatus>
              <TransactionStatusAction />
              <TransactionStatusLabel />
            </TransactionStatus>
            <TransactionToast className="mb-4">
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewBackers(idea.id)}
          icon={<Icon name="users" size="sm" />}
          className="w-full"
        >
          View Backers
        </Button>
      </div>
    </Card>
  );
}

// Backers Modal Component
type BackersModalProps = {
  idea: Idea | null;
  backers: Backer[];
  isOpen: boolean;
  onClose: () => void;
};

export function BackersModal({ idea, backers, isOpen, onClose }: BackersModalProps) {
  if (!isOpen || !idea) return null;

  const formatEth = (wei: bigint) => {
    return Number(wei) / 1e18;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--app-card-bg)] rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            Backers of "{idea.title}"
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
          >
            ×
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {backers.length === 0 ? (
            <p className="text-[var(--app-foreground-muted)] text-center">
              No backers yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {backers.map((backer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--app-background)] rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Avatar address={backer.wallet} />
                    <Address address={backer.wallet} />
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[var(--app-foreground)]">
                      {formatEth(backer.amount)} ETH
                    </div>
                    <div className="text-xs text-[var(--app-foreground-muted)]">
                      {formatDate(backer.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 