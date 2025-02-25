"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { RecipeGrid } from "@/components/recipe-grid"; 
import Footer from "@/components/footer";
import Loader from "../../components/loader";

interface Recipe {
  id: number;
  name: string;
  image?: string;
  cooking_time?: number;
  complexity?: string;
}

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("No user_id found in localStorage");
      setLoading(false);
      return;
    }

    const fetchRecentSearches = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recipes/get-search-history?user_id=${user_id}`
        );
        const data = await response.json();
        console.log("Fetched recent searches:", data);
        if (response.ok) {
          setRecentSearches(Array.isArray(data.search_history) ? data.search_history : []);
        } else {
          throw new Error(data.message || "Failed to fetch search history");
        }
      } catch (error: any) {
        console.error("Error fetching recent searches:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSearches();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-pink-100">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center dangrek-regular" style={{ color: "#19032d" }}>Recent Searches</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : recentSearches.length === 0 ? (
          <p className="text-center text-gray-500">No recent searches found.</p>
        ) : (
          <RecipeGrid recipes={recentSearches} showHeading={false} />
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-purple-500 hover:text-purple-700 font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}