"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Loader from "../../components/loader";

interface Recipe {
  id: number;
  name: string;
  image_url?: string;
  average_rating?: number | string | { average_rating: string };
}

export default function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("No user_id found in localStorage.");
      setLoading(false);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recipes/favorites/${user_id}`
        );
        const data = await response.json();
        if (response.ok) {
          setFavoriteRecipes(data || []);
        } else {
          throw new Error(data.message || "Failed to fetch favorites");
        }
      } catch (error: any) {
        console.error("❌ Error fetching favorites:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Fetch the latest average rating for a recipe.
  const fetchAverageRating = async (recipeId: number): Promise<string> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}/ratings`
      );
      const data = await response.json();
      return data.average_rating || "0.0";
    } catch (error) {
      console.error("Error fetching rating for recipe", recipeId, error);
      return "0.0";
    }
  };

  // Helper to extract and display the average rating.
  const getAverageRating = (recipe: Recipe): string => {
    if (recipe.average_rating === undefined || recipe.average_rating === null) {
      return "0.0";
    }
    if (typeof recipe.average_rating === "object") {
      return recipe.average_rating.average_rating || "0.0";
    }
    return recipe.average_rating.toString();
  };

  // Update the ratings for favorite recipes 
  useEffect(() => {
    async function updateFavoritesRatings() {
      let needUpdate = false;
      const updated = await Promise.all(
        favoriteRecipes.map(async (recipe) => {
          if (
            recipe.average_rating === undefined ||
            recipe.average_rating === null ||
            recipe.average_rating === "0.0" ||
            recipe.average_rating === 0
          ) {
            needUpdate = true;
            const avg = await fetchAverageRating(recipe.id);
            return { ...recipe, average_rating: avg };
          }
          return recipe;
        })
      );
      if (needUpdate) {
        setFavoriteRecipes(updated);
      }
    }
    if (favoriteRecipes.length > 0) {
      updateFavoritesRatings();
    }
  }, [favoriteRecipes]);

  // Remove a recipe from favorites.
  const handleRemoveFavorite = async (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");
    console.log("Removing favorite for recipe id:", recipeId, "user_id:", user_id);
    if (!user_id) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/remove-favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(user_id), recipe_id: recipeId }),
      });
      const data = await response.json();
      console.log("Remove favorite response:", data);
      if (!response.ok) throw new Error(data.message || "Failed to remove favorite");
      setFavoriteRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      window.location.reload(); // Reload the page after removing a favorite recipe
    } catch (error: any) {
      console.error("❌ Error removing favorite:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-pink-100">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center dangrek-regular" style={{ color: "#19032d" }}>
          Your Favorite Recipes
        </h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : favoriteRecipes.length === 0 ? (
          <p className="text-center text-gray-500" style={{ color: "#19032d" }}>No favorite recipes saved.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favoriteRecipes.map((recipe) => (
              <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer">
                  {/* Rating Badge on Top Right */}
                  <div className="absolute top-3 right-3 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full z-10">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-white ml-1">
                      {getAverageRating(recipe)}
                    </span>
                  </div>
                  <img
                    src={recipe.image_url || "/placeholder.svg"}
                    alt={recipe.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-lg truncate text-gray-800 dangrek-regular">
                      {recipe.name}
                    </h3>
                    <button onClick={(e) => handleRemoveFavorite(recipe.id, e)} className="focus:outline-none">
                      <Heart className="text-pink-500 h-6 w-6" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link href="/" className="text-purple-500 hover:text-purple-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </div>
  );
}