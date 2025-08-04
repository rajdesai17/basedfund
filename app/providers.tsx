"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  // Debug logging
  console.log("🔧 MiniKitProvider Config:", {
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ? "✅ Set" : "❌ Missing",
    chain: base.name,
    projectName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    logo: process.env.NEXT_PUBLIC_ICON_URL,
  });

  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
