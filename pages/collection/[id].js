import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  "https://anfgdvhvikwdfqiigzkp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZmdkdmh2aWt3ZGZxaWlnemtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODUxNTIsImV4cCI6MjA1Nzg2MTE1Mn0.Kf8UfvqgSv0c9TNTLw9m7M9qc27JjFUwQJtlgrMZf5w"
);

export default function CollectionPage() {
  const router = useRouter();
  const { id } = router.query;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    console.log("Received Collection ID:", id); // Debugging

    const fetchCollection = async () => {
      const { data, error } = await supabase
        .from("nft_collections")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching collection:", error);
      } else {
        console.log("Fetched Collection Data:", data); // Debugging
        setCollection(data);
      }
      setLoading(false);
    };

    fetchCollection();
  }, [id]);

  if (loading) return <p className="text-lg font-bold">Loading collection...</p>;
  if (!collection) return <p className="text-lg font-bold">Collection not found.</p>;

  return (
    <div className="p-6 min-h-screen bg-green-100 text-white flex justify-center items-center">
      <div className="p-6 border-2 border-black bg-blue-500 rounded-lg max-w-3xl w-full">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4" onClick={() => router.back()}>
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-2">{collection.name}</h1>

        {/* Updated Image */}
        <img 
          src={collection.image_url || "/placeholder.jpg"} 
          alt={collection.name} 
          className="w-36 h-36 mx-auto object-cover rounded-md"
        />

        {/* Website Badge */}
        <div className="mt-2 flex justify-center">
          <p className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-semibold border border-black">
            www.LilyPad.netlify
          </p>
        </div>

        <p className="text-center text-white mt-2">{collection.description}</p>

        {/* Info Container */}
        <div className="grid grid-cols-2 gap-4 bg-white border-2 border-green-700 text-black p-4 rounded-lg mt-4">
          <div className="text-center">
            <p className="font-bold">Floor Price</p>
            <p>{collection.floor_price} PEPU</p>
          </div>
          <div className="text-center">
            <p className="font-bold">Volume</p>
            <p>{collection.volume} PEPU</p>
          </div>
          <div className="text-center">
            <p className="font-bold">Items</p>
            <p>{collection.items}</p>
          </div>
          <div className="text-center">
            <p className="font-bold">Holders</p>
            <p>{collection.minters}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <p className="font-bold text-center">Mint Progress:</p>
          <div className="w-full bg-gray-300 rounded-full h-6 relative">
            <div
              className="bg-green-500 h-6 rounded-full absolute top-0 left-0"
              style={{ width: `${(collection.minted / collection.items) * 100 || 0}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">
            {collection.minted} / {collection.items} Minted ({((collection.minted / collection.items) * 100).toFixed(2) || 0}%)
          </p>
        </div>

        {/* Mint Button with Hover Animation */}
        <button className="mt-4 w-full bg-green-500 border-2 border-black text-white py-3 rounded-md font-bold text-lg transition duration-300 ease-in-out hover:bg-green-700 hover:scale-105">
          Mint NFT
        </button>
      </div>
    </div>
  );
}
