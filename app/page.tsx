"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import CategorySlider from "@/components/CategorySlider";
import { RecipeGrid } from "@/components/recipe-grid";
import Loader from "../components/loader";
import Modal from "@/components/Modal";
import PrivacyModalContent from "@/components/PrivacyModalContent";
import TermsModalContent from "@/components/TermsModalContent";
import Footer from "@/components/footer";

interface Recipe {
  id: number;
  name: string;
  image?: string;
  cooking_time: number;
  complexity: string;
  category?: string;
}

function HomeContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalType, setModalType] = useState<null | "privacy" | "terms">(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // First, check for a free-text search query ("q") in the URL.
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      // Otherwise, check if there's a category query.
      const categoryQuery = searchParams.get("category");
      if (categoryQuery) {
        handleCategorySelect(categoryQuery);
      } else {
        fetchRecipes();
      }
    }
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }
      const shuffled = data.sort(() => 0.5 - Math.random());
      setRecipes(shuffled.slice(0, 20));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Callback for free-text search.
  const handleSearch = async (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }
      setSearchResults(data.recipes || data);
      setSearchMessage(data.message || `Showing recipes for "${query}"`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Callback when a category is selected.
  const handleCategorySelect = async (category: string) => {
    router.push(`/?category=${encodeURIComponent(category.toLowerCase())}`);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/search?query=${encodeURIComponent(category.toLowerCase())}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }
      setSearchResults(data.recipes || data);
      setSearchMessage(data.message || `Showing recipes for category "${category}"`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/");
  };

  // Open and close modal functions.
  const openModal = (type: "privacy" | "terms") => {
    setModalType(type);
  };
  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-pink-100">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {/* Homepage content that blurs when modal is open */}
      <div className={`flex-grow ${modalType ? "filter blur-sm" : ""}`}>
        <section className="flex flex-col items-center justify-center text-center mt-20 px-6">
          <h2 className="text-[2.25rem] sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 cursor-pointer">
            Find the Perfect Dessert Recipe
          </h2>
          <p className="text-[0.8rem] sm:text-base text-gray-600 mt-3 max-w-2xl">
            Search from a variety of delicious dessert recipes, just by giving us the ingredients you have.
          </p>
          <div className="mt-6 w-full max-w-2xl">
            <SearchBar setSearchResults={setSearchResults} setSearchMessage={setSearchMessage} />
          </div>
        </section>
        <main className="max-w-xl md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex-grow">
          {searchResults.length > 0 ? (
            <RecipeGrid recipes={searchResults} />
          ) : loading ? (
            <Loader />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <CategorySlider onSelectCategory={handleCategorySelect} />
          )}
        </main>
      </div>

      <Footer openModal={openModal} />

      {/* Conditionally render the modal */}
      {modalType && (
        <Modal onClose={closeModal}>
          {modalType === "privacy" && <PrivacyModalContent />}
          {modalType === "terms" && <TermsModalContent />}
        </Modal>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <HomeContent />
    </Suspense>
  );
}
