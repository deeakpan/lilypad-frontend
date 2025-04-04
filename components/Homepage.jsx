import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchCollections } from "../supabase"; 
import { FaBars, FaHome, FaPlusCircle, FaLayerGroup, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { connectWallet, getWalletAddress, disconnectWallet } from "../walletConnect";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);

  useEffect(() => {
    const getCollections = async () => {
      const data = await fetchCollections();  
      console.log("Fetched collections data:", data);
      setCollections(data || []);
      setLoading(false);
    };
    getCollections();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getWalletAddress();
      setWalletAddress(address);
      console.log("Retrieved wallet address:", address);
    };
    fetchAddress();
  }, []);

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
      <div className="fixed top-0 left-0 w-full bg-blue-500 p-4 flex justify-between items-center z-50 border-b-2 border-black">
        <button onClick={() => setSidebarOpen(true)} className="text-white hover:text-gray-300">
          <FaBars size={24} />
        </button>
        <h1 className="text-3xl font-extrabold tracking-wide text-yellow-300">🌿 LilyPad</h1>
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-1 border-2 border-black rounded-md w-48 bg-white text-black" />
        <div className="flex gap-6">
          {["Newest", "Featured", "Trending"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 rounded-md font-bold border-2 border-black transition ${activeTab === tab ? 'bg-green-500 text-black' : 'bg-white text-black'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={handleWalletConnect} className="px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400 w-30">
          {walletAddress ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : "Connect"}
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}

      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 h-full bg-blue-900 p-6 border-r-2 border-black w-64 z-50 shadow-lg text-white"
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

      <main className="flex-1 p-6 transition-all duration-300 ease-in-out mt-[64px]">
        {loading ? (
          <p className="text-lg font-bold text-center">Loading collections...</p>
        ) : filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCollections.map((collection) => (
              <motion.div 
                key={collection.id} 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.5)" }}
                className="border-2 border-black p-4 rounded-lg bg-white shadow-lg flex flex-col justify-between h-auto"
              >
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                  <Image src={collection.image_url || "/placeholder.jpg"} alt={collection.name} width={350} height={350} className="rounded-md object-cover w-full h-full" />
                </div>
                <div className="flex flex-col flex-grow justify-between text-black">
                  <h2 className="text-xl font-bold mt-2">{collection.name}</h2>
                  <p>Items: {collection.items}</p>
                  <p>Minters: {collection.minters}</p>
                  <p>Floor: {collection.floor_price} PEPU</p>
                  <p>Volume: {collection.volume} PEPU</p>
                </div>
                <Link href={`/collection/${collection.id}`}>
                  <button className="mt-3 px-4 py-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-yellow-400 w-full">View</button>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-bold text-center">No collections found.</p>
        )}
      </main>

      {showDisconnectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-blue-900 border-2 border-black p-6 rounded-lg shadow-lg text-white w-80">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">Disconnect Wallet?</h2>
            <div className="flex justify-between">
              <button onClick={() => setShowDisconnectPopup(false)} className="px-4 py-2 bg-green-500 border-black border-2 rounded-md">Cancel</button>
              <button onClick={handleDisconnect} className="px-4 py-2 bg-red-500 text-white border-black border-2 rounded-md font-bold">Disconnect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}