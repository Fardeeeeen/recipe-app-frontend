"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import Link from "next/link";

interface Recipe {
  id: number;
  name: string;
  image_url?: string;
  cooking_time: number;
  complexity: string;
  average_rating?: number | string | { average_rating: string };
}

interface RecipeGridProps {
  recipes: Recipe[];
  showHeading?: boolean;
 
  heading?: string;
}

export function RecipeGrid({ recipes, showHeading = true, heading }: RecipeGridProps) {
  const router = useRouter();
  const user_id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const [favorites, setFavorites] = useState<number[]>([]);
  const [updatedRecipes, setUpdatedRecipes] = useState<Recipe[]>(recipes);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [initialLoggedIn] = useState(
    typeof window !== "undefined" && !!localStorage.getItem("token")
  );

  // Check periodically for logout if initially logged in.
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (initialLoggedIn) {
      intervalId = setInterval(() => {
        if (!localStorage.getItem("token") && !hasRefreshed) {
          setHasRefreshed(true);
          clearInterval(intervalId);
          window.location.reload();
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [initialLoggedIn, hasRefreshed]);

  // Fetch favorite recipes if user_id is available.
  useEffect(() => {
    if (!user_id) {
      console.log("No user_id found; skipping favorites fetch.");
      return;
    }
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recipes/favorites/${user_id}`
        );
        const data = await response.json();
        console.log("Favorites response:", data);
        if (response.ok && Array.isArray(data)) {
          setFavorites(data.map((recipe: Recipe) => recipe.id));
        } else {
          console.warn("Unexpected response for favorites:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [user_id]);

  // Helper: Fetch and update the average rating for a recipe.
  const fetchAverageRating = async (recipeId: number) => {
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

  // Update recipes with latest average ratings.
  useEffect(() => {
    async function updateRatings() {
      const updated = await Promise.all(
        recipes.map(async (recipe) => {
          if (
            recipe.average_rating === undefined ||
            recipe.average_rating === null ||
            recipe.average_rating === "0.0" ||
            recipe.average_rating === 0
          ) {
            const avg = await fetchAverageRating(recipe.id);
            return { ...recipe, average_rating: avg };
          }
          return recipe;
        })
      );
      setUpdatedRecipes(updated);
    }
    updateRatings();
  }, [recipes]);

  // Save recipe to search history.
  const saveRecipeToHistory = async (recipe: Recipe) => {
    if (!user_id) {
      console.warn("User not logged in; cannot save search history.");
      return;
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/save-search`;
      console.log("Saving recipe to search history at:", url, "with recipe:", recipe);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(user_id), recipe }),
      });
      const data = await response.json();
      console.log("Save search response:", data);
    } catch (error) {
      console.error("❌ Error saving recipe to search history:", error);
    }
  };

  // Toggle favorite function.
  const handleToggleFavorite = async (recipeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!user_id) {
      alert("You must be logged in to save favorites!");
      return;
    }
    const isFavorited = favorites.includes(recipeId);
    const endpoint = isFavorited
      ? `${process.env.NEXT_PUBLIC_API_URL}/recipes/remove-favorite`
      : `${process.env.NEXT_PUBLIC_API_URL}/recipes/save-favorite`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(user_id), recipe_id: recipeId }),
      });
      const data = await response.json();
      console.log("Favorite toggle response:", data);
      if (!response.ok) throw new Error(data.message || "Failed to update favorite");

      setFavorites((prevFavorites) =>
        isFavorited ? prevFavorites.filter((id) => id !== recipeId) : [...prevFavorites, recipeId]
      );
    } catch (error) {
      console.error("❌ Error updating favorite:", error);
    }
  };

  // Helper to display average rating.
  const renderRating = (recipe: Recipe): string => {
    if (typeof recipe.average_rating === "object") {
      return recipe.average_rating.average_rating || "0.0";
    }
    return recipe.average_rating ? recipe.average_rating.toString() : "0.0";
  };

  return (
    <div>
      {showHeading && (
        <div className="flex justify-between items-center mb-4 " style={{ margin:"20px"}}>
          <h2 className="text-sm sm:text-xl font-bold text-gray-800 border border-purple-500 bg-purple-500 bg-opacity-20 p-2 rounded">
            {heading ? heading : "Here are the best recipes for you"}
          </h2>
          <button
            onClick={() => {
              router.push("/");
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
            className="bg-purple-500 text-white px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base rounded hover:bg-purple-600"
          >
            Go Back
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 px-5">
        {updatedRecipes.length === 0 ? (
          <p className="text-center text-gray-600">No recipes found.</p>
        ) : (
          updatedRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {user_id && (
                <button
                  onClick={(e) => handleToggleFavorite(recipe.id, e)}
                  className="absolute top-3 left-3 z-20 text-red-500 hover:text-red-600 transition"
                >
                  <Heart className={`h-7 w-7 ${favorites.includes(recipe.id) ? "fill-red-500" : ""}`} />
                </button>
              )}
              <div className="absolute top-3 right-3 z-20 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white ml-1">
                  {renderRating(recipe)}
                </span>
              </div>
              <Link
                href={`/recipe/${recipe.id}`}
                className="block"
                onClick={() => saveRecipeToHistory(recipe)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105 cursor-pointer relative">
                  <img
                    src={recipe.image_url || "/placeholder.svg"}
                    alt={recipe.name}
                    className="w-full h-40 sm:h-60 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                    <h3 className="text-lg font-semibold truncate">{recipe.name}</h3>
                    <p className="text-sm">
                      ⏱ {recipe.cooking_time} min | ⭐ {recipe.complexity}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
