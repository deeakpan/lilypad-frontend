import { useState } from "react";
import Hero from "@/components/Hero";
import Homepage from "@/components/Homepage";
import DeployNFT from "@/components/DeployNFT"; // Correct import path for DeployNFT component

export default function Home() {
  const [showHomepage, setShowHomepage] = useState(false); // State to switch to Homepage
  const [showDeployNFT, setShowDeployNFT] = useState(false); // State to switch to DeployNFT

  // Function to handle switching between pages
  const handleDeployNFTPage = () => {
    setShowDeployNFT(true); // Show the DeployNFT page
  };

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-center">
      <div className="bg-blue-500 border-4 border-black p-8 rounded-lg">
        {showDeployNFT ? (
          <DeployNFT /> // Show the DeployNFT page if the state is true
        ) : showHomepage ? (
          <Homepage /> // Show Homepage if showHomepage is true
        ) : (
          <Hero onExplore={() => setShowHomepage(true)} onDeployNFT={handleDeployNFTPage} /> // Pass both functions to Hero
        )}
      </div>
    </div>
  );
}
