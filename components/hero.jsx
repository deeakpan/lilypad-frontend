import Image from "next/image";

export default function Hero({ onExplore }) {
  return (
    <div className="bg-dusty-green min-h-screen flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg bg-white p-4 sm:p-6 rounded-lg border-2 border-black flex flex-col items-center text-center">
        <Image
          src="/pepu2.jpg"
          alt="PePu NFT Launchpad"
          width={96}
          height={96}
          className="rounded-full mb-4 sm:w-32 sm:h-32"
        />
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          LilyPad - The First NFT Launchpad on PePuChain
        </h2>
        <p className="text-base sm:text-lg mb-4 sm:mb-6">
          Welcome to LilyPad, the first NFT launchpad on PePuChain! Deploy, mint, and trade NFTs seamlessly on the go.
        </p>
        <button
          className="bg-green-500 text-black border-2 border-black px-4 py-2 sm:px-6 sm:py-2 rounded-md hover:bg-green-400 transition duration-300"
          onClick={onExplore}
        >
          Explore Now!
        </button>
      </div>
    </div>
  );
}
