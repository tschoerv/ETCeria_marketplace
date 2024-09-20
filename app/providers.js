"use client";
import '@rainbow-me/rainbowkit/styles.css';
import {NextUIProvider} from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { cookieStorage, createStorage, http} from 'wagmi'
import { useState, useEffect } from 'react'
import { QueryTriggerProvider } from './QueryTriggerContext';
import { defineChain } from 'viem'

export const ethClassic = defineChain({
  id: 61,
  name: 'Ethereum Classic',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://etc.etcdesktop.com'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://etc.blockscout.com/' },
  },
})


export const config = getDefaultConfig({
  appName: 'ETCeria Marketplace',
  projectId: 'ab628ff4db30a8e61d5345af74379bb0',
  chains: [ ethClassic ],
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [ethClassic.id]: http()
  },
});

const client = new QueryClient();


export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
        <NextUIProvider>
        <QueryTriggerProvider>
        <main>
        {mounted && children}
        </main>
        </QueryTriggerProvider>
        </NextUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
