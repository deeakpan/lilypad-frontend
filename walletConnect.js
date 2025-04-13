import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi';


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
      url: 'https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz/' 
    },
  },
};

// Configure project ID
const projectId = 'd0b2dab20e3667281d013129f7f38720';

// Create wagmi config with the Pepe chain
export const config = createConfig({
  chains: [pepeUnchained],
  transports: {
    [pepeUnchained.id]: http('https://3409.rpc.thirdweb.com'),
  },
});

// Set up wallets (only MetaMask)
export const wallets = [
  metaMaskWallet({ projectId }),
];

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
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        await addPepeUnchainedToMetaMask();
      } else {
        console.error('Failed to switch to Pepe Unchained network:', error);
      }
    }
  }
};