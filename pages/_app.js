// pages/_app.js
import '@/styles/globals.css';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { config, wallets, pepeUnchained } from '../walletConnect';
import { useRouter } from 'next/router';

// Initialize QueryClient
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if we're on a page that should not use the default styling
  const isExcludedPage = 
    router.pathname.includes('/collection/[id]') || 
    router.pathname.includes('/DeployNFT') || 
    router.pathname.includes('/Launchpad');

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider chains={[pepeUnchained]} wallets={wallets}>
          {isExcludedPage ? (
            // Excluded pages get no wrapper - they handle their own layout
            <Component {...pageProps} />
          ) : (
            // All other pages get the original layout
            <div className="bg-green-100 min-h-screen flex justify-center items-center">
              <div className="bg-blue-500 border-4 border-black p-6 rounded-lg">
                <Component {...pageProps} />
              </div>
            </div>
          )}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default MyApp;