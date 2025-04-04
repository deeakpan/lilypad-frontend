import { BrowserProvider } from "ethers";

const WALLET_KEY = "connectedWallet";

// Check if MetaMask is available
const isMetaMaskAvailable = () => {
  return typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask;
};

// Connect to the wallet and retrieve address
export const connectWallet = async () => {
  if (!isMetaMaskAvailable()) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Redirect to MetaMask Mobile App
      window.location.href = `https://metamask.app.link/dapp/${window.location.href}`;
      return null;
    } else {
      alert("Please install MetaMask to continue.");
      return null;
    }
  }

  try {
    const provider = new BrowserProvider(window.ethereum);

    // Request accounts
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    localStorage.setItem(WALLET_KEY, walletAddress);
    return walletAddress;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

// Retrieve saved wallet address
export const getSavedWallet = () => localStorage.getItem(WALLET_KEY);

// Get wallet address from MetaMask
export const getWalletAddress = async () => {
  const savedWallet = getSavedWallet();
  if (savedWallet) return savedWallet;

  if (!isMetaMaskAvailable()) {
    console.error("MetaMask is not installed.");
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    return accounts[0] || null;
  } catch (error) {
    console.error("Error retrieving wallet address:", error);
    return null;
  }
};

// Disconnect Wallet
export const disconnectWallet = () => {
  localStorage.removeItem(WALLET_KEY);
  sessionStorage.clear();
};
