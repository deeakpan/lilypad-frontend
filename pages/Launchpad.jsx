import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FolderPlus, PlusCircle, ListTodo, 
  ArrowRight, Upload, Settings, Layers,
  ArrowLeft, Wallet
} from "lucide-react";
import { fetchCollectionsByCreator } from "../supabase";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { pepeUnchained, switchToPepeUnchained } from "../walletConnect";

export default function MobileLaunchpad() {
  const [activeSection, setActiveSection] = useState("createCollection");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use wagmi hook for wallet connection
  const { address, isConnected } = useAccount();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonHoverVariants = {
    hover: { 
      scale: 1.05,
      backgroundColor: "#FACC15", 
      color: "#000000",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.97 }
  };

  // Effect to switch to Pepe Unchained when address changes
  useEffect(() => {
    if (address) {
      switchToPepeUnchained();
    }
  }, [address]);

  // Fetch collections by creator wallet address
  useEffect(() => {
    const getCollections = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        try {
          const userCollections = await fetchCollectionsByCreator(address);
          setCollections(userCollections);
        } catch (error) {
          console.error("Error fetching collections:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCollections([]);
      }
    };

    getCollections();
  }, [address, isConnected]);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const renderCollectionSection = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-blue-500 rounded-lg border-2 border-black"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
        <div className="w-full">
          <img 
            src="/collection.jpg" 
            alt="Collection illustration" 
            className="w-36 h-36 object-cover rounded-lg mx-auto border-2 border-black shadow-lg" 
          />
        </div>
        
        <div className="w-full text-center">
          <h3 className="text-xl font-bold text-yellow-300 mb-3">Create a New Collection</h3>
          <p className="text-white mb-4 text-sm">Create your NFT collection with custom metadata, royalties, and minting options on Pepe Unchained.</p>
          
          <div className="grid grid-cols-1 gap-3 mb-4">
            <motion.div 
              variants={itemVariants}
              className="bg-blue-400 p-3 rounded-lg border border-blue-300 flex items-start"
            >
              <Settings className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
              <div className="text-left">
                <h5 className="font-bold text-white text-sm">Custom Properties</h5>
                <p className="text-gray-100 text-xs">Set name, description, and royalty percentages</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-blue-400 p-3 rounded-lg border border-blue-300 flex items-start"
            >
              <Upload className="text-green-400 mr-2 mt-1 flex-shrink-0" size={16} />
              <div className="text-left">
                <h5 className="font-bold text-white text-sm">Collection Media</h5>
                <p className="text-gray-100 text-xs">Upload logo, banner and featured images</p>
              </div>
            </motion.div>
          </div>
          
          {isConnected ? (
            <Link href="/DeployNFT">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center border-2 border-black shadow-lg mx-auto w-fit"
              >
                Get Started
                <ArrowRight className="ml-2" size={16} />
              </motion.div>
            </Link>
          ) : (
            <motion.button
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center border-2 border-black shadow-lg mx-auto"
              onClick={handleConnectWallet}
            >
              Connect Wallet
              <Wallet className="ml-2" size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderCreateNFTSection = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-blue-500 rounded-lg border-2 border-black"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
        <div className="w-full">
          <div className="relative w-36 h-36 mx-auto">
            <img 
              src="/single.jpg" 
              alt="NFT illustration" 
              className="w-36 h-36 object-cover rounded-lg border-2 border-black shadow-lg" 
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-3 -right-3 bg-yellow-300 text-black font-bold py-1 px-2 rounded-full border-2 border-black transform rotate-12 text-xs"
            >
              NEW!
            </motion.div>
          </div>
        </div>
        
        <div className="w-full text-center">
          <h3 className="text-xl font-bold text-yellow-300 mb-3">Create Single NFT</h3>
          <p className="text-white mb-4 text-sm">Mint a standalone NFT with custom media, properties, and unlockable content.</p>
          
          <div className="grid grid-cols-1 gap-3 mb-4">
            <motion.div 
              variants={itemVariants}
              className="bg-blue-400 p-3 rounded-lg border border-blue-300"
            >
              <div className="flex justify-center mb-1">
                <span className="text-green-400" role="img" aria-label="Images">🖼️</span>
              </div>
              <h5 className="font-bold text-white text-sm text-center">Multiple Media Types</h5>
              <p className="text-gray-100 text-xs text-center">Images, videos, audio, and 3D models</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-blue-400 p-3 rounded-lg border border-blue-300"
            >
              <div className="flex justify-center mb-1">
                <span className="text-green-400" role="img" aria-label="Tags">🏷️</span>
              </div>
              <h5 className="font-bold text-white text-sm text-center">Custom Traits</h5>
              <p className="text-gray-100 text-xs text-center">Add unique properties and rarity attributes</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-blue-400 p-3 rounded-lg border border-blue-300"
            >
              <div className="flex justify-center mb-1">
                <span className="text-green-400" role="img" aria-label="Lock">🔒</span>
              </div>
              <h5 className="font-bold text-white text-sm text-center">Unlockable Content</h5>
              <p className="text-gray-100 text-xs text-center">Special content visible only to owners</p>
            </motion.div>
          </div>
          
          {isConnected ? (
            <Link href="/">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center border-2 border-black shadow-lg mx-auto w-fit"
              >
                Start Creating
                <ArrowRight className="ml-2" size={16} />
              </motion.div>
            </Link>
          ) : (
            <motion.button
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center border-2 border-black shadow-lg mx-auto"
              onClick={handleConnectWallet}
            >
              Connect Wallet
              <Wallet className="ml-2" size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAddNFTsSection = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-blue-500 rounded-lg border-2 border-black"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
        <div className="w-full">
          <div className="relative w-36 h-36 mx-auto">
            <img 
              src="/add.jpg" 
              alt="Add NFTs illustration" 
              className="w-36 h-36 object-cover rounded-lg border-2 border-black shadow-lg" 
            />
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                transition: { 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut" 
                }
              }}
              className="absolute -bottom-3 -right-3 bg-green-500 text-black font-bold py-1 px-3 rounded-full border-2 border-black text-xs"
            >
              Bulk Upload
            </motion.div>
          </div>
        </div>
        
        <div className="w-full text-center">
          <h3 className="text-xl font-bold text-yellow-300 mb-3">Add NFTs to Collection</h3>
          <p className="text-white mb-3 text-sm">Bulk upload NFTs to your existing collections with automated metadata.</p>
          
          {!isConnected ? (
            <div className="mb-4 py-6">
              <p className="text-white mb-3">Connect your wallet to access your collections</p>
              <motion.button
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center justify-center border-2 border-black shadow-lg mx-auto"
                onClick={handleConnectWallet}
              >
                Connect Wallet
                <Wallet className="ml-2" size={16} />
              </motion.button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-white font-bold mb-2 text-sm" htmlFor="collection-select">
                  Choose Collection:
                </label>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
                  </div>
                ) : collections.length > 0 ? (
                  <select
                    id="collection-select"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-3 py-2 bg-blue-400 text-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="">Select a collection</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-blue-400 p-3 rounded-lg border border-blue-300 text-white">
                    No collections found. Create a collection first.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <motion.div 
                  variants={itemVariants}
                  className="bg-blue-400 p-3 rounded-lg border border-blue-300 flex items-center"
                >
                  <span className="text-green-400 mr-2 flex-shrink-0" role="img" aria-label="Upload">📤</span>
                  <span className="text-white text-sm">Upload multiple files at once</span>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-blue-400 p-3 rounded-lg border border-blue-300 flex items-center"
                >
                  <span className="text-green-400 mr-2 flex-shrink-0" role="img" aria-label="CSV">📊</span>
                  <span className="text-white text-sm">CSV import for batch metadata</span>
                </motion.div>
              </div>
              
              {selectedCollection ? (
                <Link href="/">
                  <motion.div
                    variants={buttonHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center border-2 border-black shadow-lg mx-auto w-fit"
                  >
                    Start Adding
                    <ArrowRight className="ml-2" size={16} />
                  </motion.div>
                </Link>
              ) : (
                <motion.button
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-green-500 text-black font-bold py-2 px-6 rounded-lg flex items-center border-2 border-black shadow-lg mx-auto opacity-50 cursor-not-allowed"
                  disabled
                >
                  Start Adding
                  <ArrowRight className="ml-2" size={16} />
                </motion.button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "createCollection":
        return renderCollectionSection();
      case "createNFT":
        return renderCreateNFTSection();
      case "addNFTs":
        return renderAddNFTsSection();
      default:
        return null;
    }
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
                    <Wallet className="w-4 h-4" />
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
                    <Wallet className="w-4 h-4" />
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
                >
                  <Wallet className="w-4 h-4" />
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
    <div className="bg-green-100 min-h-screen">
      {/* Mobile header with back button and wallet info */}
      <div className="p-4 flex justify-between items-center bg-blue-500 border-b-2 border-black">
        <Link href="/Homepage" className="z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white text-blue-500 p-2 rounded-full border-2 border-black"
          >
            <ArrowLeft size={20} />
          </motion.div>
        </Link>
        
        <motion.h1 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-yellow-300">Launchpad</span>
        </motion.h1>
        
        <div>
          {isConnected ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold">
              <Wallet className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">{address.slice(0, 6)}...{address.slice(-4)}</span>
              <span className="text-sm sm:hidden">{address.slice(0, 4)}...</span>
            </div>
          ) : (
            <button 
              onClick={handleConnectWallet}
              className="flex items-center gap-2 px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Connect</span>
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pb-16 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="h-1 bg-green-500 mx-auto mb-3"
          />
          <p className="text-gray-700 text-sm">Create and manage NFT collections on Pepe Unchained</p>
        </motion.div>

        <motion.div 
          className="flex overflow-x-auto pb-2 gap-2 mb-6 no-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            variants={buttonHoverVariants}
            whileTap="tap"
            className={`flex-shrink-0 flex items-center px-4 py-2 rounded-lg border-2 border-black font-bold transition-colors shadow-md ${
              activeSection === "createCollection"
                ? "bg-green-500 text-black"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => {
              setActiveSection("createCollection");
            }}
          >
            <FolderPlus className="mr-1" size={18} />
            <span className="text-sm">Create Collection</span>
          </motion.button>

          <motion.button
            variants={buttonHoverVariants}
            whileTap="tap"
            className={`flex-shrink-0 flex items-center px-4 py-2 rounded-lg border-2 border-black font-bold transition-colors shadow-md ${
              activeSection === "createNFT"
                ? "bg-green-500 text-black"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => {
              setActiveSection("createNFT");
            }}
          >
            <PlusCircle className="mr-1" size={18} />
            <span className="text-sm">Single NFT</span>
          </motion.button>

          <motion.button
            variants={buttonHoverVariants}
            whileTap="tap"
            className={`flex-shrink-0 flex items-center px-4 py-2 rounded-lg border-2 border-black font-bold transition-colors shadow-md ${
              activeSection === "addNFTs"
                ? "bg-green-500 text-black"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => {
              setActiveSection("addNFTs");
            }}
          >
            <ListTodo className="mr-1" size={18} />
            <span className="text-sm">Add NFTs</span>
          </motion.button>
        </motion.div>

        <motion.div 
          className="w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {renderSectionContent()}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-8"
        >
          <div className="inline-flex gap-2 items-center justify-center bg-blue-500 px-4 py-2 rounded-full border-2 border-black">
            <span className="text-yellow-300" role="img" aria-label="Discord">💬</span>
            <span className="text-white text-sm">Join our community</span>
          </div>
        </motion.div>
      </div>

      {/* Wallet Connection Modal */}
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
                <span aria-label="Close">✖</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="text-center mb-4">
                <Wallet className="mx-auto text-blue-500 text-3xl mb-3" />
                <h4 className="text-lg font-bold mb-2">Wallet Connection Required</h4>
                <p className="text-gray-600 mb-4">Please connect your wallet to manage your NFT collections on the LilyPad platform.</p>
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
    </div>
  );
}