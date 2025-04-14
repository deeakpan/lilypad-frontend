import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

// Define the Pepe Unchained chain
export const pepeUnchained = {
  id: 3409,
  name: 'Pepe Unchained',
  network: 'pepe',
  nativeCurrency: {
    name: 'PEPU',
    symbol: 'PEPU',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://3409.rpc.thirdweb.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Pepe Unchained Explorer',
      url: 'https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz/',
    },
  },
  iconUrl: 'https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-use/icon/base-logo.svg',
  iconBackground: '#000000',
};

// Project ID from WalletConnect
const projectId = 'd0b2dab20e3667281d013129f7f38720';

// Full wallet config (not limited to MetaMask)
export const config = getDefaultConfig({
  appName: 'Pepe Unchained',
  projectId,
  chains: [pepeUnchained],
  ssr: true,
  initialChain: pepeUnchained,
});

// App-wide provider setup
export const WalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        showRecentTransactions={true}
        chains={[pepeUnchained]}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

// Function to add Pepe Unchained network to MetaMask
export const addPepeUnchainedToMetaMask = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${pepeUnchained.id.toString(16)}`,
          chainName: pepeUnchained.name,
          nativeCurrency: pepeUnchained.nativeCurrency,
          rpcUrls: [pepeUnchained.rpcUrls.default.http[0]],
          blockExplorerUrls: [pepeUnchained.blockExplorers.default.url],
        }],
      });
      console.log('Pepe Unchained network has been added to MetaMask');
    } catch (error) {
      console.error('Failed to add Pepe Unchained network to MetaMask:', error);
    }
  }
};

// Function to switch to Pepe Unchained network
export const switchToPepeUnchained = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${pepeUnchained.id.toString(16)}` }],
      });
      console.log('Switched to Pepe Unchained network');
    } catch (error) {
      if (error.code === 4902) {
        await addPepeUnchainedToMetaMask();
      } else {
        console.error('Failed to switch to Pepe Unchained network:', error);
      }
    }
  }
};
