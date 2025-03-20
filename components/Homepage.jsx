"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  "https://anfgdvhvikwdfqiigzkp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZmdkdmh2aWt3ZGZxaWlnemtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODUxNTIsImV4cCI6MjA1Nzg2MTE1Mn0.Kf8UfvqgSv0c9TNTLw9m7M9qc27JjFUwQJtlgrMZf5w"
);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch NFT collections from Supabase
  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase.from("nft_collections").select("*");

      if (error) {
        console.error("Error fetching NFTs:", error);
      } else if (data.length === 0) {
        console.warn("No NFTs found in Supabase.");
      } else {
        console.log("Fetched collections:", data); // Debugging

        setCollections(data);
      }
      setLoading(false);
    };

    fetchCollections();
  }, []);

  return (
    <div className="flex min-h-screen bg-dusty-green">
      {/* Sidebar (No changes) */}
      <aside className="w-64 bg-white p-6 border-r-2 border-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6">LilyPad</h1>
        <nav className="space-y-4">
          <a href="#" className="block text-lg font-semibold hover:text-green-500">Home</a>
          <Link href="/DeployNFT">
            <button className="block text-lg font-semibold hover:text-green-500">Create Collection</button>
          </Link>
          <a href="#" className="block text-lg font-semibold hover:text-green-500">My Collections</a>
          <a href="#" className="block text-lg font-semibold hover:text-green-500">Profile</a>
        </nav>
      </aside>

      {/* Main Content (No changes) */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border-2 border-black rounded-md w-80"
          />
          <button className="px-4 py-2 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400">
            Connect Wallet
          </button>
        </div>

        {/* Tabs (No changes) */}
        <div className="flex space-x-4 mb-6">
          {['Newest', 'Featured', 'Trending'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 border-2 border-black rounded-md font-bold ${
                activeTab === tab ? "bg-green-500 text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Collection Grid */}
        {loading ? (
          <p className="text-lg font-bold">Loading collections...</p>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div key={collection.id} className="border-2 border-black p-4 rounded-lg bg-white shadow-lg">
                <div className="w-full h-[200px] flex items-center justify-center overflow-hidden">
                  <Image
                    src={collection.image_url || "/placeholder.jpg"} 
                    alt={collection.name}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-bold mt-2">{collection.name}</h2>
                <p>Items: {collection.items}</p>
                <p>Minters: {collection.minters}</p>
                <p>Floor Price: {collection.floor_price} PEPU</p>
                <p>Volume: {collection.volume} PEPU</p>
                <Link href={`/collection/${collection.id}`}>
                  <button className="mt-3 px-4 py-2 bg-blue-500 text-white border-2 border-black rounded-md font-bold hover:bg-blue-400 w-full">
                    View Collection
                  </button>
                </Link>
                {console.log("Collection ID:", collection.id)} {/* Debugging */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-bold">No collections found.</p>
        )}
      </main>
    </div>
  );
}
