import { BrowserProvider } from "ethers";

const WALLET_KEY = "connectedWallet";

// Connect to the wallet and retrieve address
export const connectWallet = async () => {
  // Check if MetaMask (window.ethereum) is available
  if (!window.ethereum) {
    alert("Please install MetaMask to continue.");
    return null;  // Return null if MetaMask isn't available
  }

  try {
    // Request the user's accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a provider
    const provider = new BrowserProvider(window.ethereum);
    
    // Retrieve the wallet address
    const accounts = await provider.send("eth_accounts", []);  // Alternative way to get accounts
    const walletAddress = accounts[0];  // Take the first account address
    
    localStorage.setItem(WALLET_KEY, walletAddress);  // Store the address
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
    return savedWallet; // Return saved wallet address if it exists
  }

  // Check if MetaMask (window.ethereum) is available
  if (!window.ethereum) {
    console.error("MetaMask is not installed or Ethereum provider is not available.");
    return null;  // Return null if MetaMask isn't available
  }

  try {
    // Create a provider
    const provider = new BrowserProvider(window.ethereum);
    
    // Alternative way to get accounts
    const accounts = await provider.send("eth_accounts", []);
    const address = accounts[0];  // Take the first account address
    
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

  if (window.ethereum && window.ethereum.disconnect) {
    await window.ethereum.disconnect();
  }
};
