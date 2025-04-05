import { ethers } from "ethers";

const WALLET_KEY = "connectedWallet";

// Check if MetaMask is available
const isMetaMaskAvailable = () => {
  return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
};

// Connect to the wallet and retrieve address
export const connectWallet = async () => {
  if (!isMetaMaskAvailable()) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Open MetaMask mobile deep link to handle mobile interaction
      window.open("https://metamask.app.link/dapp/" + window.location.host, "_blank");
      return new Promise(resolve => {
        // Since on mobile MetaMask doesn’t always immediately return the address,
        // we need to keep trying until we get the address.
        const interval = setInterval(async () => {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            clearInterval(interval);
            localStorage.setItem(WALLET_KEY, accounts[0]);
            resolve(accounts[0]);
          }
        }, 1000); // Retry every second
      });
    } else {
      alert("Please install MetaMask to continue.");
      return null;
    }
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

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
    console.error("MetaMask is not installed.");
    return null;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error("Error retrieving wallet address:", error);
    return null;
  }
};

// Disconnect the wallet and clear local storage
export const disconnectWallet = async () => {
  localStorage.removeItem(WALLET_KEY);
  sessionStorage.clear();
};
