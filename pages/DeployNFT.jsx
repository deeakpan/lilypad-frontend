"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaTimes, FaCheck, FaImage, FaInfoCircle, FaWallet } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { pepeUnchained, switchToPepeUnchained } from "../walletConnect";

// Initialize Supabase
const supabase = createClient(
  "https://anfgdvhvikwdfqiigzkp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZmdkdmh2aWt3ZGZxaWlnemtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODUxNTIsImV4cCI6MjA1Nzg2MTE1Mn0.Kf8UfvqgSv0c9TNTLw9m7M9qc27JjFUwQJtlgrMZf5w"
);

export default function DeployNFT() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    items: "",
    floorPrice: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [collectionData, setCollectionData] = useState(null);
  const formRef = useRef(null);

  // Use wagmi hook for wallet connection
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Focus on the form container to ensure it stays in view when keyboard appears
    const handleFocus = () => {
      if (formRef.current) {
        setTimeout(() => {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };

    const inputFields = document.querySelectorAll('input, textarea');
    inputFields.forEach(field => {
      field.addEventListener('focus', handleFocus);
    });

    return () => {
      inputFields.forEach(field => {
        field.removeEventListener('focus', handleFocus);
      });
    };
  }, []);

  // Effect to switch to Pepe Unchained when address changes
  useEffect(() => {
    if (address) {
      switchToPepeUnchained();
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure floorPrice and items are numeric inputs
    if (name === "items") {
      // Allow only positive integers for items
      if (/^\d*$/.test(value) && !value.includes("+") && !value.includes("-")) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "floorPrice") {
      // Allow only positive numbers with decimal points for floor price
      if (/^\d*\.?\d*$/.test(value) && !value.includes("+") && !value.includes("-")) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.image !== null &&
    formData.description.trim() !== "" &&
    formData.items.trim() !== "" &&
    formData.floorPrice.trim() !== "";

  const handleDeploy = async () => {
    if (!isFormValid) return;
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }
    setIsDeploying(true);

    const fileExt = formData.image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data: imgData, error: imgError } = await supabase.storage
      .from("nft-images")
      .upload(filePath, formData.image);

    if (imgError) {
      alert("Error uploading image: " + imgError.message);
      setIsDeploying(false);
      return;
    }

    const imageUrl = `https://anfgdvhvikwdfqiigzkp.supabase.co/storage/v1/object/public/nft-images/public/${fileName}`;

    // Add creator_wallet to the data being inserted
    const { data, error } = await supabase
      .from("nft_collections")
      .insert([
        {
          name: formData.name,
          image_url: imageUrl,
          description: formData.description,
          items: formData.items,
          minters: 0,
          floor_price: formData.floorPrice,
          volume: 0,
          category: "newest",
          creator_wallet: address, // Store the connected wallet address
        },
      ])
      .select("id")
      .single();

    setIsDeploying(false);
    
    if (error) {
      alert("Error deploying NFT: " + error.message);
      return;
    }

    setCollectionData({
      id: data.id,
      name: formData.name,
      image_url: imageUrl,
      description: formData.description,
      items: formData.items,
      floorPrice: formData.floorPrice,
      creator_wallet: address, // Include creator wallet in collection data
    });

    setShowConfirmModal(false);
    setShowSuccessPopup(true);
    setFormData({ name: "", image: null, description: "", items: "", floorPrice: "" });
    setImagePreview(null);
  };

  const handleSubmitForm = () => {
    if (isFormValid) {
      if (!isConnected) {
        setShowWalletModal(true);
      } else {
        setShowConfirmModal(true);
      }
    }
  };

  // Navigate to homepage function
  const navigateToHomepage = () => {
    router.push('/Launchpad');
  };

  // Custom RainbowKit Connect Button for modal
  const CustomConnectButton = () => (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
                  >
                    <FaWallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== pepeUnchained.id) {
                return (
                  <button
                    onClick={openChainModal}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-yellow-500 text-black border-2 border-black rounded-md font-bold hover:bg-yellow-400"
                  >
                    <FaWallet className="w-4 h-4" />
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
                >
                  <FaWallet className="w-4 h-4" />
                  <span>{account.displayName}</span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-green-100 p-4 pt-16 pb-24 overflow-y-auto">
      {/* Back Button with Icon - Updated to use router for homepage navigation */}
      <button 
        onClick={navigateToHomepage}
        className="absolute top-4 left-4 text-black flex items-center space-x-2 bg-white hover:bg-green-200 px-3 py-2 rounded-full shadow-md border border-black"
      >
        <FaArrowLeft className="text-sm" />
        <span className="text-sm hidden sm:inline">Back</span>
      </button>

      {/* Heading with Adjusted Margin and fixed rounded logo */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <Image 
            src="/lilypad_hero.jpg" 
            alt="PEPU Logo" 
            width={80} 
            height={80} 
            className="w-full h-full rounded-full object-cover" 
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-black text-center mt-3">
          Deploy New NFT Collection
        </h1>
        <p className="text-sm sm:text-base text-gray-700 text-center mt-2 max-w-md">
          Fill in the details below to deploy your NFT collection on the LilyPad platform.
        </p>
      </div>

      {/* Wallet Connection Status */}
      <div className="w-full max-w-lg mb-4 flex justify-end">
        {isConnected ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold">
            <FaWallet className="w-4 h-4" />
            <span className="text-sm">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        ) : (
          <button 
            onClick={() => setShowWalletModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white border-2 border-black rounded-md font-bold hover:bg-blue-600"
          >
            <FaWallet className="w-4 h-4" />
            <span className="text-sm">Connect Wallet</span>
          </button>
        )}
      </div>

      <div ref={formRef} className="w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500 p-5 rounded-lg shadow-lg border-4 border-black"
        >
          <div className="flex flex-col space-y-4">
            <div className="space-y-1">
              <label className="text-white text-sm font-medium">Collection Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. Pepe Gems" 
                className="border-black border-2 p-3 rounded-md w-full" 
                onChange={handleChange} 
                value={formData.name} 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-white text-sm font-medium">Description</label>
              <textarea 
                name="description" 
                placeholder="Describe your collection..." 
                className="border-black border-2 p-3 rounded-md h-24 w-full" 
                onChange={handleChange} 
                value={formData.description} 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-white text-sm font-medium">Collection Image</label>
              <div className="flex items-center space-x-3">
                <label className="flex-1 cursor-pointer">
                  <div className="border-black border-2 p-1 rounded-md bg-white flex items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                    <div className="flex items-center">
                      <FaImage className="mr-2" />
                      <span>{formData.image ? formData.image.name : "Choose Image"}</span>
                    </div>
                  </div>
                </label>
                
                {imagePreview && (
                  <div className="h-14 w-14 rounded-md overflow-hidden border-2 border-black">
                    <Image src={imagePreview} alt="Preview" width={56} height={56} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-white text-sm font-medium">Number of Items</label>
                <input 
                  type="text" 
                  inputMode="numeric" 
                  name="items" 
                  placeholder="e.g. 1000" 
                  className="border-black border-2 p-3 rounded-md w-full" 
                  onChange={handleChange} 
                  value={formData.items} 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-white text-sm font-medium">Floor Price (PEPU)</label>
                <input 
                  type="text" 
                  inputMode="decimal" 
                  name="floorPrice" 
                  placeholder="e.g. 0.5" 
                  className="border-black border-2 p-3 rounded-md w-full" 
                  onChange={handleChange} 
                  value={formData.floorPrice} 
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 text-black font-bold border-2 border-black rounded-md mt-2 transition-colors ${
                isFormValid ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-400 cursor-not-allowed'
              }`} 
              onClick={handleSubmitForm} 
              disabled={!isFormValid || isDeploying}
            >
              Deploy Collection
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Wallet Connection Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl border-4 border-blue-500 w-full max-w-md mx-auto"
            >
              <div className="bg-blue-500 p-3 sm:p-4 flex justify-between items-center border-b-2 border-black">
                <h3 className="text-lg sm:text-xl font-bold text-white">Connect Wallet</h3>
                <button 
                  onClick={() => setShowWalletModal(false)}
                  className="text-white hover:text-red-200"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="text-center mb-4">
                  <FaWallet className="mx-auto text-blue-500 text-3xl mb-3" />
                  <h4 className="text-lg font-bold mb-2">Wallet Connection Required</h4>
                  <p className="text-gray-600 mb-4">Please connect your wallet to deploy your NFT collection on the LilyPad platform.</p>
                </div>
                
                <CustomConnectButton />
                
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-full py-2 mt-3 bg-gray-200 text-black font-bold border-2 border-black rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal - Updated to show wallet info */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl border-4 border-blue-500 w-full max-w-md mx-auto"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="bg-blue-500 p-3 sm:p-4 flex justify-between items-center border-b-2 border-black">
                <h3 className="text-lg sm:text-xl font-bold text-white">Confirm Collection Details</h3>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="text-white hover:text-red-200"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {imagePreview && (
                    <div className="w-full sm:w-1/3">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-black">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  )}
                  
                  <div className="w-full sm:w-2/3 space-y-2">
                    <h4 className="font-bold text-lg">{formData.name}</h4>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">DESCRIPTION</p>
                      <p className="text-sm">{formData.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">ITEMS</p>
                        <p className="text-sm font-semibold">{formData.items}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">FLOOR PRICE</p>
                        <p className="text-sm font-semibold">{formData.floorPrice} PEPU</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Wallet information section */}
                <div className="border-t border-gray-200 pt-3 mb-3">
                  <p className="text-xs text-gray-500 font-medium">CREATOR WALLET</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaWallet className="text-green-500" />
                    <p className="text-sm font-semibold">{address.slice(0, 6)}...{address.slice(-4)}</p>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2 bg-gray-200 text-black font-bold border-2 border-black rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="flex-1 py-2 bg-green-500 text-black font-bold border-2 border-black rounded-md hover:bg-green-400 flex justify-center items-center"
                  >
                    {isDeploying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        <span>Confirm & Deploy</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup - Updated to show creator wallet info */}
      <AnimatePresence>
        {showSuccessPopup && collectionData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border-4 border-green-500 w-full max-w-md mx-auto"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="bg-green-500 p-4 flex items-center justify-center relative border-b-2 border-black">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { delay: 0.2, type: "spring" } }}
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 border-4 border-green-500"
                >
                  <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center">
                    <FaCheck className="text-white text-xl" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold text-black mt-6">Success!</h3>
              </div>
              
              <div className="p-4 sm:p-6">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  className="text-center text-green-700 font-medium mb-4"
                >
                  Your NFT collection has been successfully deployed
                </motion.p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-2/5">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, transition: { delay: 0.4 } }}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-black shadow-md"
                    >
                      <Image 
                        src={collectionData.image_url} 
                        alt={collectionData.name} 
                        width={200}
                        height={200}
                        className="h-full w-full object-cover" 
                      />
                    </motion.div>
                  </div>
                  
                  <div className="w-full sm:w-3/5 space-y-3">
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1, transition: { delay: 0.5 } }}
                    >
                      <p className="text-xs text-gray-500 font-medium">COLLECTION NAME</p>
                      <p className="text-lg font-bold">{collectionData.name}</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1, transition: { delay: 0.6 } }}
                    >
                      <p className="text-xs text-gray-500 font-medium">DESCRIPTION</p>
                      <p className="text-sm">{collectionData.description}</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1, transition: { delay: 0.7 } }}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      <div>
                        <p className="text-xs text-gray-500 font-medium">ITEMS</p>
                        <p className="text-sm font-semibold">{collectionData.items}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">FLOOR PRICE</p>
                        <p className="text-sm font-semibold">{collectionData.floorPrice} PEPU</p>
                      </div>
                    </motion.div>
                    
                    {/* Add creator wallet to success popup */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1, transition: { delay: 0.8 } }}
                    >
                      <p className="text-xs text-gray-500 font-medium">CREATOR WALLET</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaWallet className="text-green-500 w-3 h-3" />
                        <p className="text-sm font-mono">{collectionData.creator_wallet.slice(0, 6)}...{collectionData.creator_wallet.slice(-4)}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link href={`/collection/${collectionData.id}`} className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, transition: { delay: 0.9 } }}
                      className="w-full py-3 bg-blue-500 text-white px-4 rounded-md border-2 border-black hover:bg-blue-600 font-bold"
                    >
                      View Collection
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 1.0 } }}
                    onClick={navigateToHomepage}
                    className="w-full py-2 bg-transparent text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}