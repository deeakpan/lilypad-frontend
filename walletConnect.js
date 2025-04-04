import { BrowserProvider } from "ethers";

const WALLET_KEY = "connectedWallet";

// Check if MetaMask is available (both mobile and desktop)
const isMetaMaskAvailable = () => {
  const { ethereum } = window;
  return Boolean(ethereum && (ethereum.isMetaMask || ethereum.provider?.isMetaMask));
};

// Connect to the wallet and retrieve address
export const connectWallet = async () => {
  // Check if MetaMask is available
  if (!isMetaMaskAvailable()) {
    // Detect if on mobile and MetaMask isn't installed
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Redirect to MetaMask app
      window.open('https://metamask.app.link/dapp/' + window.location.host);
      return null;
    } else {
      alert("Please install MetaMask to continue.");
      return null;
    }
  }

  try {
    // Get the appropriate provider
    const provider = window.ethereum.provider || window.ethereum;
    
    // Request the user's accounts
    await provider.request({ method: "eth_requestAccounts" });

    // Create an ethers provider
    const ethersProvider = new BrowserProvider(provider);
    
    // Retrieve the wallet address
    const accounts = await ethersProvider.send("eth_accounts", []);
    const walletAddress = accounts[0];
    
    localStorage.setItem(WALLET_KEY, walletAddress);
    return walletAddress;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

// Retrieve saved wallet address from local storage
export const getSavedWallet = () => {
  return localStorage.getItem(WALLET_KEY);
};

// Get wallet address from local storage or request new address
export const getWalletAddress = async () => {
  const savedWallet = getSavedWallet();
  if (savedWallet) {
    return savedWallet;
  }

  if (!isMetaMaskAvailable()) {
    console.error("MetaMask is not installed or Ethereum provider is not available.");
    return null;
  }

  try {
    const provider = window.ethereum.provider || window.ethereum;
    const ethersProvider = new BrowserProvider(provider);
    
    const accounts = await ethersProvider.send("eth_accounts", []);
    const address = accounts[0];
    
    return address;
  } catch (error) {
    console.error("Error retrieving wallet address:", error);
    return null;
  }
};

// Disconnect the wallet and clear local storage
export const disconnectWallet = async () => {
  localStorage.removeItem(WALLET_KEY);
  sessionStorage.clear();

  const provider = window.ethereum?.provider || window.ethereum;
  if (provider?.disconnect) {
    await provider.disconnect();
  }
};