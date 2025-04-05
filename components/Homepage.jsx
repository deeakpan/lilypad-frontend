import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "../supabase"; 
import { FaBars, FaHome, FaPlusCircle, FaLayerGroup, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { connectWallet, getWalletAddress, disconnectWallet } from "../walletConnect";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);

  // Use React Query for fetching collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections
  });

  // Use React Query for wallet address
  const { data: savedWalletAddress } = useQuery({
    queryKey: ['walletAddress'],
    queryFn: getWalletAddress,
    onSuccess: (address) => {
      if (address) setWalletAddress(address);
    }
  });

  const handleWalletConnect = async () => {
    if (walletAddress) {
      setShowDisconnectPopup(true);
    } else {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setWalletAddress(null);
    setShowDisconnectPopup(false);
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-dark-green text-white">
      {/* Header - Made responsive */}
      <div className="fixed top-0 left-0 w-full bg-blue-500 p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center z-50 border-b-2 border-black gap-2 sm:gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-white hover:text-gray-300">
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-yellow-300">🌿 LilyPad</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="px-3 py-1 border-2 border-black rounded-md w-full sm:w-48 bg-white text-black"
          />
          
          <div className="flex gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {["Newest", "Featured", "Trending"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base font-bold border-2 border-black transition whitespace-nowrap
                  ${activeTab === tab ? 'bg-green-500 text-black' : 'bg-white text-black'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleWalletConnect} 
            className="px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400 w-full sm:w-auto whitespace-nowrap"
          >
            {walletAddress ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : "Connect"}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar - Made responsive */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 h-full bg-blue-900 p-4 sm:p-6 border-r-2 border-black w-64 z-50 shadow-lg text-white"
      >
        <h1 className="text-lg font-bold mb-6 text-yellow-300">LilyPad Menu</h1>
        <nav className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold hover:text-green-400">
            <FaHome /> Home
          </Link>
          <Link href="/DeployNFT" className="flex items-center gap-2 text-lg font-semibold hover:text-green-400">
            <FaPlusCircle /> Create Collection
          </Link>
          <Link href="/my-collections" className="flex items-center gap-2 text-lg font-semibold hover:text-green-400">
            <FaLayerGroup /> My Collections
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-lg font-semibold hover:text-green-400">
            <FaUser /> Profile
          </Link>
        </nav>
      </motion.aside>

      {/* Main content - Made responsive */}
      <main className="flex-1 p-4 sm:p-6 transition-all duration-300 ease-in-out mt-[140px] sm:mt-[80px]">
        {isLoading ? (
          <p className="text-lg font-bold text-center">Loading collections...</p>
        ) : filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCollections.map((collection) => (
              <motion.div 
                key={collection.id} 
                whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.5)" }}
                className="border-2 border-black p-3 sm:p-4 rounded-lg bg-white shadow-lg flex flex-col justify-between h-auto"
              >
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                  <Image 
                    src={collection.image_url || "/placeholder.jpg"} 
                    alt={collection.name} 
                    width={350} 
                    height={350} 
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col flex-grow justify-between text-black mt-3">
                  <h2 className="text-lg sm:text-xl font-bold">{collection.name}</h2>
                  <div className="space-y-1 mt-2 text-sm sm:text-base">
                    <p>Items: {collection.items}</p>
                    <p>Minters: {collection.minters}</p>
                    <p>Floor: {collection.floor_price} PEPU</p>
                    <p>Volume: {collection.volume} PEPU</p>
                  </div>
                </div>
                <Link href={`/collection/${collection.id}`} className="block mt-3">
                  <button className="w-full px-4 py-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-yellow-400 transition-colors">
                    View
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-bold text-center">No collections found.</p>
        )}
      </main>

      {/* Disconnect popup - Made responsive */}
      {showDisconnectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-blue-900 border-2 border-black p-4 sm:p-6 rounded-lg shadow-lg text-white w-full max-w-xs sm:w-80">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">Disconnect Wallet?</h2>
            <div className="flex justify-between gap-4">
              <button 
                onClick={() => setShowDisconnectPopup(false)} 
                className="flex-1 px-4 py-2 bg-green-500 border-black border-2 rounded-md hover:bg-green-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDisconnect} 
                className="flex-1 px-4 py-2 bg-red-500 text-white border-black border-2 rounded-md font-bold hover:bg-red-400 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}