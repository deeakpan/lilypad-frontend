import Image from "next/image";

export default function Hero({ onExplore }) {
  return (
    <div className="bg-dusty-green min-h-screen flex justify-center items-center py-10">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg border-2 border-black flex flex-col items-center">
        <Image src="/pepu2.jpg" alt="PePu NFT Launchpad" width={128} height={128} className="rounded-full mb-4" />
        <h2 className="text-center text-xl font-bold mb-4">
          LilyPad - The First NFT Launchpad on PePuChain
        </h2>
        <p className="text-center text-lg mb-6">
          Welcome to LilyPad, the first NFT launchpad on PePuChain! Deploy, mint, and trade NFTs seamlessly on the go.
        </p>
        <button
          className="bg-green-500 text-black border-2 border-black px-6 py-2 rounded-md hover:bg-green-400 transition duration-300"
          onClick={onExplore} // Calls the function passed from index.js
        >
          Explore Now!
        </button>
      </div>
    </div>
  );
}
