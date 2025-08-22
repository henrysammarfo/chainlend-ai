import React from 'react';
import { UniversalKitProvider as ZetaUniversalKitProvider } from '@zetachain/universalkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { zetaTestnet } from '@zetachain/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect } from 'wagmi/connectors';

// Create wagmi config
const config = createConfig({
  chains: [zetaTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId: 'your-project-id' }) // Optional: Add WalletConnect
  ],
  transports: {
    [zetaTestnet.id]: http(process.env.ZETACHAIN_RPC_URL || 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public'),
  },
});

// Create query client
const queryClient = new QueryClient();

// ZetaChain configuration
const zetaChainConfig = {
  network: "testnet",
  chains: {
    zeta_testnet: {
      api: [
        {
          url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
          type: "evm",
        },
      ],
    },
  },
};

interface UniversalKitProviderProps {
  children: React.ReactNode;
}

export const UniversalKitProvider: React.FC<UniversalKitProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ZetaUniversalKitProvider 
          config={config} 
          client={queryClient}
          zetaChainConfig={zetaChainConfig}
        >
          {children}
        </ZetaUniversalKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
