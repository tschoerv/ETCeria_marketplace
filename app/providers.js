"use client";

import React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { classic } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const projectId = "ab628ff4db30a8e61d5345af74379bb0";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [classic],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "ETCeria Marketplace",
  projectId,
  chains,
});

const appInfo = {
  appName: "ETCeria Marketplace",
};

const connectors = connectorsForWallets([
  ...wallets
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const Providers = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={appInfo}
        modalSize="compact"
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
