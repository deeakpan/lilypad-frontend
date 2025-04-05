import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://anfgdvhvikwdfqiigzkp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZmdkdmh2aWt3ZGZxaWlnemtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyODUxNTIsImV4cCI6MjA1Nzg2MTE1Mn0.Kf8UfvqgSv0c9TNTLw9m7M9qc27JjFUwQJtlgrMZf5w";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch collections from Supabase
export const fetchCollections = async () => {
  const { data, error } = await supabase.from("nft_collections").select("*");
  if (error) {
    console.error("Error fetching collections:", error);  // Log any error that happens during fetch
    return [];
  }
  return data || [];
};

export default supabase;