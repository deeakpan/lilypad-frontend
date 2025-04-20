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

    const fetchCollection = async () => {
      const { data, error } = await supabase
        .from("nft_collections")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching collection:", error);
      } else {
        setCollection(data);
      }
      setLoading(false);
    };

    fetchCollection();
  }, [id]);

  if (loading) return <div className="p-4 text-lg font-bold text-center">Loading collection...</div>;
  if (!collection) return <div className="p-4 text-lg font-bold text-center">Collection not found.</div>;

  return (
    <div className="bg-green-100 min-h-screen p-4 md:py-8">
      <div className="max-w-md md:max-w-2xl mx-auto bg-blue-500 border-4 border-black rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4" 
            onClick={() => router.back()}
          >
            ← Back
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">{collection.name}</h1>

          {/* Collection Image - Smaller on mobile, larger on desktop */}
          <div className="flex justify-center">
            <img 
              src={collection.image_url || "/placeholder.jpg"} 
              alt={collection.name} 
              className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-md"
            />
          </div>

          {/* Website Badge */}
          <div className="mt-2 flex justify-center">
            <p className="px-3 py-1 bg-gray-500 text-white rounded-full text-xs md:text-sm font-semibold border border-black">
              https://lilypad-mint.netlify.app/
            </p>
          </div>

          {/* Description - Limit height on mobile */}
          <div className="mt-3 text-center text-white max-h-24 md:max-h-full overflow-y-auto">
            <p>{collection.description}</p>
          </div>
        </div>

        {/* Info Container */}
        <div className="mx-4 mb-4 grid grid-cols-2 gap-3 bg-white border-2 border-green-700 text-black p-3 rounded-lg">
          <div className="text-center">
            <p className="font-bold text-sm md:text-base">Floor Price</p>
            <p className="text-sm md:text-base">{collection.floor_price} PEPU</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm md:text-base">Volume</p>
            <p className="text-sm md:text-base">{collection.volume} PEPU</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm md:text-base">Items</p>
            <p className="text-sm md:text-base">{collection.items}</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm md:text-base">Holders</p>
            <p className="text-sm md:text-base">{collection.minters}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mx-4 mb-4">
          <p className="font-bold text-center text-white text-sm md:text-base">Mint Progress:</p>
          <div className="w-full bg-gray-300 rounded-full h-4 md:h-6 relative">
            <div
              className="bg-green-500 h-4 md:h-6 rounded-full absolute top-0 left-0"
              style={{ width: `${(collection.minted / collection.items) * 100 || 0}%` }}
            ></div>
          </div>
          <p className="text-center mt-1 text-white text-xs md:text-sm">
            {collection.minted} / {collection.items} Minted ({((collection.minted / collection.items) * 100).toFixed(2) || 0}%)
          </p>
        </div>

        {/* Mint Button */}
        <div className="p-4 pt-0">
          <button className="w-full bg-green-500 border-2 border-black text-white py-2 md:py-3 rounded-md font-bold text-base md:text-lg transition duration-300 ease-in-out hover:bg-green-700 hover:scale-105">
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  );
}