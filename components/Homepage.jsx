import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "../supabase"; 
import { 
  FaBars, FaTimes, FaHome, FaPlusCircle, FaInfoCircle, 
  FaLayerGroup, FaUser, FaSearch, FaWallet, FaChartBar, 
  FaFire, FaShoppingBag, FaGem, FaHistory, FaBullhorn,
  FaHeart, FaAward, FaStar, FaBookmark, FaGift
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { pepeUnchained, switchToPepeUnchained } from "../walletConnect";
import { useAccount } from 'wagmi';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Newest");
  const [activeCategory, setActiveCategory] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  // Use wagmi hook for wallet connection
  const { address } = useAccount();

  // Use React Query for fetching collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections
  });

  // Effect to switch to Pepe Unchained when address changes
  useEffect(() => {
    if (address) {
      switchToPepeUnchained();
    }
  }, [address]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle mobile sidebar
      const mobileSidebar = document.getElementById('mobile-sidebar');
      const hamburgerBtn = document.getElementById('hamburger-button');
      
      if (sidebarOpen && mobileSidebar && !mobileSidebar.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        setSidebarOpen(false);
      }
      
      // Handle desktop sidebar
      const desktopSidebar = document.getElementById('desktop-sidebar');
      const desktopBtn = document.getElementById('desktop-sidebar-button');
      
      if (desktopSidebarOpen && desktopSidebar && !desktopSidebar.contains(event.target) && !desktopBtn.contains(event.target)) {
        setDesktopSidebarOpen(false);
      }
    };

    // Prevent scrolling when mobile sidebar is open
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, desktopSidebarOpen]);

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen(!desktopSidebarOpen);
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom styled RainbowKit Connect Button
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
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
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black border-2 border-black rounded-md font-bold hover:bg-yellow-400"
                  >
                    <FaWallet className="w-4 h-4" />
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
                >
                  <FaWallet className="w-4 h-4" />
                  <span>
                    {account.displayName}
                    
                  </span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

  // Mobile version of custom connect button - FIXED VERSION
  const MobileConnectButton = () => (
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
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
                    style={{
                      // Ensure the modal opens with full wallet options
                      WebkitAppearance: 'none'
                    }}
                  >
                    <FaWallet className="w-4 h-4" />
                    <span className="text-sm">Connect</span>
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== pepeUnchained.id) {
                return (
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-black border-2 border-black rounded-md font-bold hover:bg-yellow-400"
                  >
                    <FaWallet className="w-4 h-4" />
                    <span className="text-sm">Switch</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400"
                >
                  <FaWallet className="w-4 h-4" />
                  <span className="text-sm">{account.displayName.slice(0, 6) + "..."}</span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

  // Improved "Coming Soon" UI
  const renderComingSoon = (tabName) => {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-blue-900 rounded-lg border-2 border-black shadow-lg p-8 w-full max-w-lg mx-auto">
        <div className="text-yellow-300 text-6xl mb-4">🚧</div>
        <h2 className="text-3xl font-bold text-yellow-300 mb-2">{tabName}</h2>
        <p className="text-white text-xl">Coming Soon to LilyPad</p>
        <div className="mt-6 bg-green-500 text-black font-bold py-2 px-6 rounded-md border-2 border-black">
          Stay Tuned!
        </div>
      </div>
    );
  };

  // Improved "No Results" UI
  const renderNoResults = () => {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-blue-900 rounded-lg border-2 border-black shadow-lg p-8 w-full max-w-lg mx-auto">
        <div className="text-yellow-300 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Collection Not Found</h2>
        <p className="text-white text-lg text-center">We couldn't find any collections matching your search.</p>
        <button 
          onClick={() => setSearchQuery("")} 
          className="mt-6 bg-green-500 text-black font-bold py-2 px-6 rounded-md border-2 border-black"
        >
          Clear Search
        </button>
      </div>
    );
  };

  // Sidebar animation variants with bouncing effect
  const sidebarVariants = {
    open: { 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
        restDelta: 0.01,
        bounce: 0.4
      } 
    },
    closed: { 
      x: "-100%", 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25
      } 
    }
  };

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, transition: { duration: 0.2 } }
  };

  // Define categories for sidebar and navigation
  const navigationCategories = {
    explore: [
      { name: "Collections", icon: <FaLayerGroup className="w-5 h-5" />, path: "/", active: true },
      { name: "Stats", icon: <FaChartBar className="w-5 h-5" />, path: "/stats", active: false },
      { name: "Drops", icon: <FaGift className="w-5 h-5" />, path: "/drops", active: false },
      { name: "Marketplace", icon: <FaShoppingBag className="w-5 h-5" />, path: "/marketplace", active: false },
      { name: "Rankings", icon: <FaAward className="w-5 h-5" />, path: "/rankings", active: false },
    ],
    create: [
      { name: "Launchpad", icon: <FaPlusCircle className="w-5 h-5" />, path: "/DeployNFT", active: true },
      { name: "Create NFT", icon: <FaPlusCircle className="w-5 h-5" />, path: "/create-nft", active: false },
      { name: "My Collections", icon: <FaLayerGroup className="w-5 h-5" />, path: "/my-collections", active: false },
    ],
    account: [
      { name: "Profile", icon: <FaUser className="w-5 h-5" />, path: "/profile", active: false },
      { name: "Favorites", icon: <FaHeart className="w-5 h-5" />, path: "/favorites", active: false },
      { name: "Transaction History", icon: <FaHistory className="w-5 h-5" />, path: "/history", active: false },
      { name: "Watchlist", icon: <FaBookmark className="w-5 h-5" />, path: "/watchlist", active: false },
    ],
    other: [
      { name: "About", icon: <FaInfoCircle className="w-5 h-5" />, path: "https://docs.google.com/document/d/1MVjbYivJxyqC5In5k37iX9kG3YQdhGKcl-PAlVhw3xo/edit?usp=sharing", active: true, external: true },
      { name: "News", icon: <FaBullhorn className="w-5 h-5" />, path: "/news", active: false },
    ]
  };

  return (
    <div className="min-h-screen bg-dark-green text-white">
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {desktopSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 hidden lg:block"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={() => setDesktopSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:block">
        <motion.div
          id="desktop-sidebar"
          className="fixed top-0 left-0 h-screen w-64 bg-blue-900 border-r-2 border-black z-50"
          initial="closed"
          animate={desktopSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
        >
          <div className="h-16 flex items-center pl-5 border-b-2 border-black">
            <h2 className="text-xl font-bold text-yellow-300 text-left">Menu</h2>
          </div>

          <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-5 flex flex-col space-y-6">
              {Object.entries(navigationCategories).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm uppercase text-green-400 font-bold tracking-wider">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <div className="space-y-3 pl-1">
                    {items.map((item) => (
                      item.external ? (
                        <a 
                          key={item.name}
                          href={item.path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-lg font-semibold hover:text-green-400 w-full text-left"
                        >
                          {item.icon} {item.name}
                        </a>
                      ) : (
                        <Link 
                          key={item.name}
                          href={item.path} 
                          className={`flex items-center gap-3 text-lg font-semibold hover:text-green-400 w-full text-left ${
                            !item.active ? 'opacity-70 cursor-default' : ''
                          }`}
                          onClick={(e) => !item.active && e.preventDefault()}
                        >
                          {item.icon} {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            
            <div className="mt-auto p-4 border-t-2 border-black">
              <p className="text-sm text-white text-center">© 2025 LilyPad</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Header - Now full width */}
      <div className="fixed top-0 left-0 right-0 w-full bg-blue-500 p-4 shadow-lg z-40 border-b-2 border-black">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                id="hamburger-button"
                onClick={toggleSidebar} 
                className="text-white z-50"
              >
                {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>

              {/* Replaced 🌿 emoji with image */}
              <div className="flex items-center space-x-0.7">
                <img 
                  src="/lilypad_homepage-removebg-preview.png" 
                  alt="LilyPad Logo" 
                  className="rounded-full object-cover w-[45px] h-[45px]"
                />
                <h1 className="text-2xl font-extrabold tracking-wide text-yellow-300">LilyPad</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={toggleSearchBar} className="text-white">
                <FaSearch className="w-5 h-5" />
              </button>
              {/* Use the fixed mobile connect button */}
              <MobileConnectButton />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                id="desktop-sidebar-button"
                onClick={toggleDesktopSidebar}
                className="text-white"
              >
                <FaBars className="w-6 h-6" />
              </button>
              
              {/* Logo Image and Text */}
              <div className="flex items-center space-x-0.8">
                <img 
                  src="/lilypad_homepage-removebg-preview.png" 
                  alt="LilyPad Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <h1 className="text-3xl font-extrabold tracking-wide text-yellow-300">LilyPad</h1>
              </div>

              {/* Search Bar - Now after branding with rounded edges */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search collections..."
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-black rounded-full w-60 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Collection Tabs */}
              <div className="flex space-x-2">
                {["Newest", "Featured", "Trending"].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`px-4 py-2 rounded-md text-base font-bold border-2 border-black transition
                      ${activeTab === tab ? 'bg-green-500 text-black' : 'bg-white text-black'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <CustomConnectButton />
            </div>
          </div>

          
          {/* Mobile Search Bar */}
          {searchVisible && (
            <div className="lg:hidden mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-full bg-white text-black"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Mobile Tabs */}
          <div className="lg:hidden flex justify-between mt-4 overflow-x-auto pb-2">
            {["Newest", "Featured", "Trending"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-3 py-1 rounded-md text-sm font-bold border-2 border-black transition flex-1 mx-1
                  ${activeTab === tab ? 'bg-green-500 text-black' : 'bg-white text-black'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        id="mobile-sidebar"
        className="fixed top-0 left-0 h-screen w-64 bg-blue-900 border-r-2 border-black z-50 lg:hidden"
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="sticky top-0 bg-blue-900 p-6 border-b-2 border-black">
          <h2 className="text-xl font-bold text-yellow-300 text-left">Menu</h2>
        </div>

        <div className="flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="flex-1 p-6">
            {Object.entries(navigationCategories).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm uppercase text-green-400 font-bold tracking-wider mb-3">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="space-y-3 pl-1">
                  {items.map((item) => (
                    item.external ? (
                      <a 
                        key={item.name}
                        href={item.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-lg font-semibold hover:text-green-400 w-full text-left"
                      >
                        {item.icon} {item.name}
                      </a>
                    ) : (
                      <Link 
                        key={item.name}
                        href={item.path} 
                        className={`flex items-center gap-2 text-lg font-semibold hover:text-green-400 w-full text-left ${
                          !item.active ? 'opacity-70 cursor-default' : ''
                        }`}
                        onClick={(e) => !item.active && e.preventDefault()}
                      >
                        {item.icon} {item.name}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="mt-auto p-4 border-t-2 border-black">
            <p className="text-sm text-white text-center">© 2025 LilyPad</p>
          </div>
        </div>
      </motion.div>

      {/* Main content - Using the natural dark-green background with full-width blue background */}
      <div className="bg-dark-green min-h-screen" style={{ paddingTop: "calc(4rem + 48px)" }}>
        <div className="w-full bg-blue-500 min-h-screen">
          <div 
            className={`max-w-7xl mx-auto px-17 py-6 transition-all duration-300 ${sidebarOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg font-bold text-center">Loading collections...</p>
              </div>
            ) : activeTab === "Newest" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((collection) => (
                    <motion.div 
                      key={collection.id} 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-black rounded-lg bg-white shadow-lg flex flex-col transform transition duration-500 hover:shadow-xl overflow-hidden"
                    >
                      <div className="w-full aspect-square relative border-b-2 border-black">
                        <Image 
                          src={collection.image_url || "/placeholder.jpg"} 
                          alt={collection.name} 
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="p-3 lg:p-4 flex flex-col text-black">
                        <h2 className="text-base sm:text-lg font-bold truncate">{collection.name}</h2>
                        
                        {/* Desktop - Vertical layout */}
                        <div className="hidden lg:flex flex-col space-y-1 mt-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-gray-600">Items:</span>
                            <span className="text-sm">{collection.items}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-gray-600">Minters:</span>
                            <span className="text-sm">{collection.minters}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-gray-600">Floor:</span>
                            <span className="text-sm">{collection.floor_price} PEPU</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-gray-600">Volume:</span>
                            <span className="text-sm">{collection.volume} PEPU</span>
                          </div>
                        </div>
                        
                        {/* Mobile - Compact layout */}
                        <div className="lg:hidden grid grid-cols-2 gap-x-6 gap-y-0.5 mt-1.5">
                          <div>
                            <span className="text-xs font-semibold text-gray-600">Items:</span>
                            <span className="text-xs ml-1">{collection.items}</span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-600">Minters:</span>
                            <span className="text-xs ml-1">{collection.minters}</span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-600">Floor:</span>
                            <span className="text-xs ml-1">{collection.floor_price}</span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-600">Volume:</span>
                            <span className="text-xs ml-1">{collection.volume}</span>
                          </div>
                        </div>
                        
                        <Link href={`/collection/${collection.id}`} className="block mt-3">
                          <button className="w-full px-2.5 py-1.5 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-yellow-400 transition-colors text-sm">
                            View
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                    {renderNoResults()}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                {renderComingSoon(activeTab)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}