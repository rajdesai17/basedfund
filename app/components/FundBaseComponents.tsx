"use client";

import { type ReactNode, useState, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
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
import { Address, Avatar } from "@coinbase/onchainkit/identity";
import { FUNDBASE_ABI, TOKENS } from "@/lib/contract";

// Types
export type Idea = {
  id: string;
  title: string;
  description: string;
  creator: string;
  totalRaisedETH: bigint;
  backerCount: number;
  createdAt: number;
};

export type Backer = {
  wallet: string;
  token: string;
  amount: bigint;
  timestamp: number;
};

export type TokenBalance = {
  token: string;
  amount: bigint;
};

// ===== BASE COMPONENTS =====

// Button Component
type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  loading?: boolean;
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
  loading = false,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative";

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
    outline:
      "border-2 border-blue-600 hover:bg-blue-50 text-blue-600 hover:border-blue-700",
    ghost:
      "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
    warning:
      "bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {icon && <span className={`flex items-center ${loading ? 'opacity-0' : 'mr-2'}`}>{icon}</span>}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
}

// Input Component
type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email" | "password";
  className?: string;
  maxLength?: number;
  required?: boolean;
  error?: string;
};

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  maxLength,
  required = false,
  error,
}: InputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Textarea Component
type TextareaProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
  maxLength?: number;
  required?: boolean;
  error?: string;
};

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className = "",
  maxLength,
  required = false,
  error,
}: TextareaProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Select Component
type SelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: ReactNode }[];
  className?: string;
  required?: boolean;
  error?: string;
};

export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
  required = false,
  error,
}: SelectProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Card Component
type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "elevated" | "outlined";
};

export function Card({
  title,
  subtitle,
  children,
  className = "",
  onClick,
  variant = "default",
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const variantClasses = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white border border-gray-200 shadow-lg hover:shadow-xl",
    outlined: "bg-white border-2 border-gray-200",
  };

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-200 ${variantClasses[variant]} ${className} ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      {title && (
            <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// Badge Component
type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  size?: "sm" | "md";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    info: "bg-blue-100 text-blue-800",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 rounded-full",
    md: "text-sm px-2.5 py-1 rounded-full",
  };

  return (
    <span className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

// Progress Bar Component
type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
};

export function ProgressBar({
  value,
  max,
  className = "",
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{value.toFixed(2)} ETH</span>
          <span>{max.toFixed(2)} ETH</span>
        </div>
      )}
    </div>
  );
}

// ===== ICON COMPONENTS =====

// Icon Component
type IconProps = {
  name: "plus" | "heart" | "users" | "trending" | "lightbulb" | "arrow-right" | "check" | "eth" | "usdc" | "zora" | "calendar" | "wallet" | "star" | "fire";
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
    eth: (
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
        <title>ETH</title>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    usdc: (
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
        <title>USDC</title>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    zora: (
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
        <title>ZORA</title>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    calendar: (
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
        <title>Calendar</title>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    wallet: (
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
        <title>Wallet</title>
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 7v12a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0-2 2v4h4v-4a2 2 0 0 0-2-2z" />
      </svg>
    ),
    star: (
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
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    fire: (
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
        <title>Fire</title>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2.5C8.5 9 8 8.5 8 7.5c0-1.5 1-2.5 2.5-2.5S13 6 13 7.5c0 1-.5 1.5-1.5 2.5S10 10.62 10 12a2.5 2.5 0 0 0 2.5 2.5z" />
        <path d="M12 2c-1.5 0-2.5 1-2.5 2.5S10.5 7 12 7s2.5-1 2.5-2.5S13.5 2 12 2z" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}

// ===== FEATURE COMPONENTS =====

// Post Idea Component
type PostIdeaProps = {
  onIdeaPosted: (idea: Idea) => void;
};

export function PostIdea({ onIdeaPosted }: PostIdeaProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [overfundingMechanism, setOverfundingMechanism] = useState("Burn Excess");
  const { address } = useAccount();

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!fundingGoal.trim()) newErrors.fundingGoal = "Funding goal is required";
    
    const goal = parseFloat(fundingGoal);
    if (isNaN(goal) || goal <= 0) newErrors.fundingGoal = "Please enter a valid funding goal";
    
    return Object.keys(newErrors).length === 0;
  }, [title, description]);

  const handleSubmit = useCallback(() => {
    if (!validateForm() || !address) return;

    const newIdea: Idea = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      creator: address,
      totalRaisedETH: BigInt(0),
      backerCount: 0,
      createdAt: Date.now(),
    };

    onIdeaPosted(newIdea);
    setTitle("");
    setDescription("");
    setFundingGoal("");
    setOverfundingMechanism("Burn Excess");
  }, [title, description, fundingGoal, address, onIdeaPosted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!address) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-1">Post New Idea</h2>
          <p className="text-sm text-gray-600">Share your startup concept onchain</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Icon name="lightbulb" size="lg" className="mx-auto text-blue-600" />
            <p className="text-gray-600">
          Connect your wallet to post an idea
        </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-base font-medium text-gray-900 mb-1">Post New Idea</h2>
        <p className="text-sm text-gray-600">Share your startup concept onchain</p>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            maxLength={100}
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the problem, solution, and market opportunity..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-40"
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (ETH)</label>
          <input
            type="number"
            placeholder="e.g., 10.0"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overfunding Mechanism</label>
          <select
            value={overfundingMechanism}
            onChange={(e) => setOverfundingMechanism(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="Burn Excess">Burn Excess Funds</option>
            <option value="Creator Wallet">Send to Creator Wallet</option>
            <option value="Community Pool">Redirect to Community Pool</option>
          </select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim() || !fundingGoal.trim() || Number.parseFloat(fundingGoal) <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Post Idea
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-600 space-y-2">
          <div className="font-medium text-gray-800 mb-3">Platform Guidelines</div>
          <div>• Ideas are recorded onchain via Base</div>
          <div>• Community funding through ETH contributions</div>
          <div>• All transactions are publicly verifiable</div>
          <div>• Higher funding increases project visibility</div>
        </div>
      </div>
    </div>
  );
}

// Idea Card Component
type IdeaCardProps = {
  idea: Idea;
  onBack: (ideaId: string, token: string, amount: bigint) => void;
  onViewBackers: (ideaId: string) => void;
  onWithdraw?: (ideaId: string) => void;
};

export function IdeaCard({ idea, onBack, onViewBackers, onWithdraw }: IdeaCardProps) {
  const [backAmount, setBackAmount] = useState("0.1");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [showWithdrawTransaction, setShowWithdrawTransaction] = useState(false);
  const { address } = useAccount();
  const sendNotification = useNotification();

  const calls = useMemo(() => {
    if (!address || !backAmount) return [];

    const amount = selectedToken === "ETH" 
      ? BigInt(parseFloat(backAmount) * 1e18)
      : BigInt(parseFloat(backAmount) * (selectedToken === "USDC" ? 1e6 : 1e18));

    if (selectedToken === "ETH") {
      return [
        {
          to: (process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
          data: encodeFunctionData({
            abi: FUNDBASE_ABI,
            functionName: 'backIdeaWithETH',
            args: [idea.id],
          }),
          value: amount,
        },
      ];
    } else {
      return [
        {
          to: (process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
          data: encodeFunctionData({
            abi: FUNDBASE_ABI,
            functionName: 'backIdeaWithToken',
            args: [idea.id, TOKENS[selectedToken as keyof typeof TOKENS] as `0x${string}`, amount],
          }),
          value: BigInt(0),
        },
      ];
    }
  }, [address, backAmount, idea.id, selectedToken]);

  // Withdrawal transaction calls
  const withdrawCalls = useMemo(() => {
    if (!address) return [];

    return [
      {
        to: (process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
        data: encodeFunctionData({
          abi: FUNDBASE_ABI,
          functionName: 'withdrawFunds',
          args: [idea.id],
        }),
        value: BigInt(0),
      },
    ];
  }, [address, idea.id]);

  const handleTransactionSuccess = useCallback((response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;
    const amount = selectedToken === "ETH" 
      ? BigInt(parseFloat(backAmount) * 1e18)
      : BigInt(parseFloat(backAmount) * (selectedToken === "USDC" ? 1e6 : 1e18));
    
    onBack(idea.id, selectedToken, amount);
    setBackAmount("0.1");

    sendNotification({
      title: "Idea Backed! 💰",
      body: `You backed "${idea.title}" with ${backAmount} ${selectedToken}!`,
    });

    console.log(`Transaction successful: ${transactionHash}`);
  }, [backAmount, idea.id, idea.title, selectedToken, onBack, sendNotification]);

  const handleTransactionError = useCallback((error: TransactionError) => {
    console.error("Transaction failed:", error);
    
    // Show user-friendly error message
    const errorMessage = error.message || "Transaction failed. Please try again.";
    sendNotification({
      title: "Transaction Failed ❌",
      body: errorMessage,
    });
  }, [sendNotification]);

  const handleWithdrawSuccess = useCallback((response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;
    
    setShowWithdrawTransaction(false);
    onWithdraw?.(idea.id);

    sendNotification({
      title: "Funds Withdrawn! 💰",
      body: `Successfully withdrew funds from "${idea.title}"!`,
    });

    console.log(`Withdrawal successful: ${transactionHash}`);
  }, [idea.id, idea.title, onWithdraw, sendNotification]);

  const handleWithdrawError = useCallback((error: TransactionError) => {
    console.error("Withdrawal failed:", error);
    setShowWithdrawTransaction(false);
    
    // Show user-friendly error message
    const errorMessage = error.message || "Withdrawal failed. Please try again.";
    sendNotification({
      title: "Withdrawal Failed ❌",
      body: errorMessage,
    });
  }, [sendNotification]);

  const formatEth = (wei: bigint) => {
    return Number(wei) / 1e18;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const fundingPercentage = (formatEth(idea.totalRaisedETH) / 10) * 100; // Assuming 10 ETH goal
  const isFunded = fundingPercentage >= 100;

  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-4">
      <div className="p-5 flex items-start gap-4">
        {/* Icon based on status */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
            ${isFunded ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
        >
          {isFunded ? <Icon name="check" size="sm" /> : <Icon name="lightbulb" size="sm" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-medium text-gray-900 truncate">{idea.title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium 
                ${isFunded ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}
            >
              {isFunded ? "Funded" : "Active"}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{idea.description}</p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isFunded ? 'bg-green-600' : 'bg-gray-900'
                }`}
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{fundingPercentage.toFixed(0)}% Funded</span>
              <span>
                {formatEth(idea.totalRaisedETH).toFixed(1)} ETH / {idea.backerCount} Backers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              Creator:{" "}
              <span className="font-mono text-gray-700">
                {idea.creator.slice(0, 6)}...{idea.creator.slice(-4)}
              </span>
            </span>
            <span>
              Date: <span className="text-gray-700">{formatDate(idea.createdAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Funding Actions */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center text-xs h-8 px-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
            onClick={() => onViewBackers(idea.id)}
          >
            View Backers
          </button>

          {/* Withdraw button for creators */}
          {address && address.toLowerCase() === idea.creator.toLowerCase() && (
            !showWithdrawTransaction ? (
              <button
                type="button"
                className="inline-flex items-center justify-center text-xs h-8 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                onClick={() => setShowWithdrawTransaction(true)}
              >
                Withdraw Funds
              </button>
            ) : (
              <Transaction
                calls={withdrawCalls}
                onSuccess={handleWithdrawSuccess}
                onError={handleWithdrawError}
              >
                <TransactionButton className="inline-flex items-center justify-center text-xs h-8 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors" />
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
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="0.1"
            value={backAmount}
            onChange={(e) => setBackAmount(e.target.value)}
            className="w-20 h-8 text-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-2 bg-white text-gray-900 placeholder-gray-500"
            step="0.01"
          />
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-[70px] h-8 text-sm bg-white border border-gray-300 rounded-lg px-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
          >
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="ZORA">ZORA</option>
          </select>
          <Transaction
            calls={calls}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          >
            <TransactionButton 
              className="inline-flex items-center justify-center text-sm px-3 py-1 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!backAmount || Number.parseFloat(backAmount) <= 0}
            />
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
        </div>
      </div>
    </div>
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

  const formatAmount = (amount: bigint, token: string) => {
    const decimals = token === "USDC" ? 6 : 18;
    return Number(amount) / Math.pow(10, decimals);
  };

  const getTokenName = (tokenAddress: string) => {
    if (tokenAddress === TOKENS.ETH) return "ETH";
    if (tokenAddress === TOKENS.USDC) return "USDC";
    if (tokenAddress === TOKENS.ZORA) return "ZORA";
    return "Unknown";
  };

  const getTokenIcon = (tokenAddress: string) => {
    const tokenName = getTokenName(tokenAddress);
    switch (tokenName) {
      case "ETH": return <Icon name="eth" size="sm" />;
      case "USDC": return <Icon name="usdc" size="sm" />;
      case "ZORA": return <Icon name="zora" size="sm" />;
      default: return <Icon name="eth" size="sm" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Backers for &quot;{idea.title}&quot;
          </h3>
            <p className="text-sm text-gray-600 mt-1">
              A record of all contributions to this project
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {backers.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="users" size="lg" className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
              No backers yet. Be the first!
            </p>
            </div>
          ) : (
            <div className="space-y-3">
              {backers.map((backer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar address={backer.wallet as `0x${string}`} />
                    <div>
                      <div className="font-medium text-gray-900">
                        <Address address={backer.wallet as `0x${string}`} />
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Icon name="calendar" size="sm" className="mr-1" />
                        {formatDate(backer.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {getTokenIcon(backer.token)}
                      <span className="font-semibold text-gray-900">
                        {formatAmount(backer.amount, getTokenName(backer.token))} {getTokenName(backer.token)}
                      </span>
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