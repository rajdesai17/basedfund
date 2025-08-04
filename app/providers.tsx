"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { WagmiProvider } from "wagmi";
import { createWagmiConfig, validateApiKey } from "@/lib/wagmi-config";

export function Providers(props: { children: ReactNode }) {
  // For testing, you can temporarily switch to Base Sepolia
  // Change this to 'base' once your mainnet project is set up
  const selectedChain = base; // or baseSepolia for testing

  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME;
  const iconUrl = process.env.NEXT_PUBLIC_ICON_URL;

  // Debug logging
  console.log("🔧 MiniKitProvider Config:", {
    apiKey: apiKey ? (validateApiKey(apiKey) ? "✅ Valid" : "⚠️ Invalid") : "❌ Missing",
    chain: selectedChain.name,
    chainId: selectedChain.id,
    projectName: projectName,
    logo: iconUrl,
  });

  // Validate required environment variables
  if (!apiKey) {
    console.error("❌ NEXT_PUBLIC_ONCHAINKIT_API_KEY is missing");
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold mb-2">Configuration Error</h3>
        <p>NEXT_PUBLIC_ONCHAINKIT_API_KEY is not configured.</p>
        <p className="text-sm mt-2">
          Please get your API key from the{" "}
          <a 
            href="https://developer.coinbase.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Coinbase Developer Platform
          </a>
        </p>
      </div>
    );
  }

  if (!validateApiKey(apiKey)) {
    console.error("❌ Invalid API key format");
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold mb-2">Invalid API Key</h3>
        <p>The API key format is invalid. Please check your configuration.</p>
      </div>
    );
  }

  if (!projectName) {
    console.error("❌ NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME is missing");
    return (
      <div className="p-4 text-red-600">
        Error: NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME is not configured
      </div>
    );
  }

  // Create Wagmi configuration with proper error handling
  const config = createWagmiConfig(selectedChain);

  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <MiniKitProvider
          apiKey={apiKey}
          chain={selectedChain}
          config={{
            appearance: {
              mode: "auto",
              theme: "mini-app-theme",
              logo: iconUrl,
            },
          }}
        >
          {props.children}
        </MiniKitProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
