"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  setSearchResults: (results: any[]) => void;
  setSearchMessage: (message: string) => void;
}

export function SearchBar({ setSearchResults, setSearchMessage }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // On component mount, check if there's a "q" parameter in the URL and set it as the query
  useEffect(() => {
    const initialQuery = searchParams.get("q") || "";
    setQuery(initialQuery);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSearchMessage("");
    setLoading(true);

    if (!query.trim()) {
      setLoading(false);
      return;
    }

    try {
      const searchUrl = `${process.env.NEXT_PUBLIC_API_URL}/recipes/search?query=${encodeURIComponent(query)}`;
      console.log("Searching recipes at:", searchUrl);
      const response = await fetch(searchUrl);

      if (!response.ok) throw new Error("Failed to fetch search results.");

      const data = await response.json();
      console.log("Search Results:", data);

      // Update search results from the API
      if (data.recipes && data.recipes.length > 0) {
        setSearchResults(data.recipes);
      } else if (data.alternativeRecipes && data.alternativeRecipes.length > 0) {
        setSearchResults(data.alternativeRecipes);
      } else {
        setSearchResults([]);
      }
      // Show the backend message directly.
      setSearchMessage(data.message || "");

      // Update the URL with the search query parameter 'q'
      router.push(`/?q=${encodeURIComponent(query)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage("Something went wrong. Please try again.");
        console.error("Search error:", error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            className="w-full pl-10 pr-2 py-2 text-sm sm:pl-12 sm:pr-4 sm:py-3 sm:text-base rounded-full border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white bg-opacity-80 backdrop-blur-sm transition duration-300 ease-in-out"
            placeholder="Type in the ingredients, type of dessert or recipe you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
          </div>
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-xs sm:px-6 sm:text-base text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-full transition duration-300 ease-in-out hover:from-purple-600 hover:to-pink-600"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      {errorMessage && (
        <p className="text-center text-3xl text-red-500 font-bold mt-4">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
