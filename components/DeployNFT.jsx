"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link
import { FaArrowLeft } from "react-icons/fa"; // Importing the back arrow icon

// Initialize Supabase
const supabase = createClient(
  "https://anfgdvhvikwdfqiigzkp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZmdkdmh2aWt3ZGZxaWlnemtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODUxNTIsImV4cCI6MjA1Nzg2MTE1Mn0.Kf8UfvqgSv0c9TNTLw9m7M9qc27JjFUwQJtlgrMZf5w"
);

export default function DeployNFT() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    items: "",
    floorPrice: "",
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure floorPrice and items are numeric inputs
    if (name === "items" || name === "floorPrice") {
      // Allow only digits (positive integers)
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.image !== null &&
    formData.description.trim() !== "" &&
    formData.items.trim() !== "" &&
    formData.floorPrice.trim() !== "";

  const handleDeploy = async () => {
    if (!isFormValid) return;
    setIsDeploying(true);

    const fileExt = formData.image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data: imgData, error: imgError } = await supabase.storage
      .from("nft-images")
      .upload(filePath, formData.image);

    if (imgError) {
      alert("Error uploading image: " + imgError.message);
      setIsDeploying(false);
      return;
    }

    const imageUrl = `https://anfgdvhvikwdfqiigzkp.supabase.co/storage/v1/object/public/nft-images/public/${fileName}`;

    const { data, error } = await supabase
      .from("nft_collections")
      .insert([
        {
          name: formData.name,
          image_url: imageUrl,
          description: formData.description,
          items: formData.items,
          minters: 0,
          floor_price: formData.floorPrice,
          volume: 0,
          category: "newest",
        },
      ])
      .select("id")
      .single(); // Fetch the inserted collection ID

    setIsDeploying(false);
    if (error) return alert("Error deploying NFT!");

    setPopup({
      id: data.id, // Store collection ID
      name: formData.name,
      image_url: imageUrl,
      description: formData.description,
      items: formData.items,
      floorPrice: formData.floorPrice,
    });

    setFormData({ name: "", image: null, description: "", items: "", floorPrice: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      {/* Back Button with Icon */}
      <button
        className="absolute top-6 left-4 text-black flex items-center space-x-2 hover:bg-green-600 px-4 py-2 rounded-md"
        onClick={() => router.push("/")}
      >
        <FaArrowLeft /> {/* Back arrow icon */}
        <span className="text-sm"></span>
      </button>

      {/* Heading with Adjusted Margin */}
      <h1 className="text-2xl font-bold text-black mb-10 text-center">
        Deploy New NFT Collection
      </h1>

      <Image src="/pepu2.jpg" alt="PEPU Logo" width={100} height={100} className="rounded-full mb-4" />
      <p className="text-lg text-black text-center mb-6">
        Welcome to LilyPad! Fill in the details below to deploy your NFT collection.
      </p>

      <div className="w-full max-w-lg bg-blue-500 p-6 rounded-lg shadow-lg border-4 border-black">
        <div className="flex flex-col space-y-4">
          <input type="text" name="name" placeholder="Collection Name" className="border-black border-2 p-2 rounded-md" onChange={handleChange} value={formData.name} />
          <textarea name="description" placeholder="Description" className="border-black border-2 p-2 rounded-md h-24" onChange={handleChange} value={formData.description} />
          <input type="file" accept="image/*" className="border-black border-2 p-2 rounded-md" onChange={handleFileChange} />
          <input type="text" name="items" placeholder="Number of Items" className="border-black border-2 p-2 rounded-md" onChange={handleChange} value={formData.items} />
          <input type="text" name="floorPrice" placeholder="Floor Price (PEPU)" className="border-black border-2 p-2 rounded-md" onChange={handleChange} value={formData.floorPrice} />

          <button className={`w-full py-2 text-white font-bold border-2 border-black rounded-md ${isFormValid ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`} onClick={handleDeploy} disabled={!isFormValid || isDeploying}>
            {isDeploying ? 'Deploying...' : 'Deploy NFT'}
          </button>
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-blue-500 text-left w-96">
            <h2 className="text-xl font-bold text-black mb-2">NFT Collection Successfully Deployed</h2>
            <div className="flex gap-4">
              <Image src={popup.image_url} alt="NFT Image" width={150} height={150} className="rounded-lg" />
              <div>
                <p className="text-black font-bold">Collection: {popup.name}</p>
                <p className="text-black">Description: {popup.description}</p>
                <p className="text-black">Items: {popup.items}</p>
                <p className="text-black">Floor Price: {popup.floorPrice} PEPU</p>
              </div>
            </div>
            <Link href={`/collection/${popup.id}`}>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md border-2 border-black hover:bg-green-600 w-full">
                View Collection
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
