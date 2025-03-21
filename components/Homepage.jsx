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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase.from("nft_collections").select("*");
      if (error) {
        console.error("Error fetching NFTs:", error);
      } else {
        setCollections(data);
      }
      setLoading(false);
    };
    fetchCollections();
  }, []);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-dusty-green">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white p-6 border-r-2 border-black transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out w-64 z-40 shadow-lg`}>
        <button className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-md shadow-md" onClick={() => setSidebarOpen(false)}>✕</button>
        <h1 className="text-2xl font-bold mb-6">LilyPad</h1>
        <nav className="space-y-4">
          <a href="#" className="block text-lg font-semibold hover:text-green-500">Home</a>
          <Link href="/DeployNFT"><button className="block text-lg font-semibold hover:text-green-500">Create Collection</button></Link>
          <a href="#" className="block text-lg font-semibold hover:text-green-500">My Collections</a>
          <a href="#" className="block text-lg font-semibold hover:text-green-500">Profile</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          {!sidebarOpen && (<button className="text-white text-2xl ml-[-10px]" onClick={() => setSidebarOpen(true)}>☰</button>)}
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-1 border-2 border-black rounded-md w-48 mx-4" />
          <button className="px-3 py-1 bg-green-500 text-black border-2 border-black rounded-md font-bold hover:bg-green-400 w-28 ml-auto">Connect</button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4 ml-[27px]">
          {["Newest", "Featured", "Trending"].map((tab) => (
            <button key={tab} className={`px-3 py-1 border-2 border-black rounded-md text-sm font-bold ${activeTab === tab ? "bg-green-500 text-white" : "bg-white"}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {/* Collection Grid */}
        {loading ? (
          <p className="text-lg font-bold text-right">Loading collections...</p>
        ) : filteredCollections.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-[27px]">
            {filteredCollections.map((collection) => (
              <div key={collection.id} className="border-2 border-black p-4 rounded-lg bg-white shadow-lg flex flex-col justify-between h-auto">
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                  <Image src={collection.image_url || "/placeholder.jpg"} alt={collection.name} width={350} height={350} className="rounded-md object-cover w-full h-full" />
                </div>
                <div className="flex flex-col flex-grow justify-between">
                  <h2 className="text-xl font-bold mt-2">{collection.name}</h2>
                  <p>Items: {collection.items}</p>
                  <p>Minters: {collection.minters}</p>
                  <p>Floor: {collection.floor_price} PEPU</p>
                  <p>Volume: {collection.volume} PEPU</p>
                </div>
                <Link href={`/collection/${collection.id}`}>
                  <button className="mt-3 px-4 py-2 bg-blue-500 text-white border-2 border-black rounded-md font-bold hover:bg-blue-400 w-full">View</button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-bold text-right">No collections found.</p>
        )}
      </main>
    </div>
  );
}
