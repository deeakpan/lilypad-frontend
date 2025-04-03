import { BrowserProvider } from "ethers"; 

const WALLET_KEY = "connectedWallet";

// Detect MetaMask Mobile
const isMetaMaskMobile = () => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    return true;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("metamask");
};

// Connect Wallet (PC & Mobile)
export const connectWallet = async () => {
  if (!window.ethereum) {
    if (isMetaMaskMobile()) {
      // Open MetaMask Mobile app (Deep link)
      window.location.href = "https://metamask.app.link/dapp/" + window.location.href;
      return null;
    }
    alert("Please install MetaMask to continue.");
    return null;
  }

  try {
    // Request user to connect wallet (always works on mobile)
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    // Use BrowserProvider for ethers v6+
    const provider = new BrowserProvider(window.ethereum);

    const walletAddress = accounts[0];

    localStorage.setItem(WALLET_KEY, walletAddress);
    return walletAddress;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

// Get Saved Wallet
export const getSavedWallet = () => {
  return localStorage.getItem(WALLET_KEY);
};

// Get Wallet Address (PC & Mobile)
export const getWalletAddress = async () => {
  const savedWallet = getSavedWallet();
  if (savedWallet) {
    return savedWallet;
  }

  if (!window.ethereum) {
    console.error("MetaMask is not installed.");
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    return accounts[0];
  } catch (error) {
    console.error("Error retrieving wallet address:", error);
    return null;
  }
};

// Disconnect Wallet
export const disconnectWallet = async () => {
  localStorage.removeItem(WALLET_KEY);
  if (window.ethereum && window.ethereum.disconnect) {
    await window.ethereum.disconnect();
  }
};
