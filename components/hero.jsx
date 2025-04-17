import Image from "next/image";

export default function Hero({ onExplore }) {
  return (
    <div className="bg-dusty-green min-h-screen flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-8 rounded-xl border-3 border-black shadow-lg flex flex-col items-center text-center">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-5 sm:mb-6">
          <Image
            src="/lilypad_hero.jpg"
            alt="LilyPad NFT Launchpad"
            fill
            className="rounded-full object-cover border-2 border-black"
            priority
          />
        </div>
        
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3 sm:mb-4 text-blue-900">
          LilyPad - The First NFT Launchpad on PePuChain
        </h1>
        
        <p className="text-base sm:text-lg mb-5 sm:mb-7 text-gray-700 max-w-md">
          Welcome to LilyPad, the premier NFT launchpad on PePuChain! Create, mint, and trade NFTs seamlessly with our powerful platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto sm:justify-center">
          <button
            className="bg-green-500 text-black border-2 border-black px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition duration-300 shadow-md"
            onClick={onExplore}
          >
            Explore Collections
          </button>
          
          <button
            className="bg-yellow-400 text-black border-2 border-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition duration-300 shadow-md"
          >
            Create NFT
          </button>
        </div>
        
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg sm:text-xl text-blue-900">100+</span>
            <span className="text-xs sm:text-sm text-gray-600">Collections</span>
          </div>
          
          <div className="w-px h-10 bg-gray-300"></div>
          
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg sm:text-xl text-blue-900">5.2k</span>
            <span className="text-xs sm:text-sm text-gray-600">Artists</span>
          </div>
          
          <div className="w-px h-10 bg-gray-300"></div>
          
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg sm:text-xl text-blue-900">24.5k</span>
            <span className="text-xs sm:text-sm text-gray-600">NFTs</span>
          </div>
        </div>
      </div>
    </div>
  );
}