"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Star } from "lucide-react";
import Link from "next/link";
import Loader from "../../../components/loader";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Recipe {
  id: number;
  name: string;
  video_url?: string;
  description: string;
  ingredients: string | string[];
  instructions: string | string[];
  average_rating?: number;
}

interface Comment {
  id: number;
  user_id: number;
  username: string;
  comment_text: string;
  created_at: string;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Rating and comments states.
  const [rating, setRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Comment editing states.
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    setIsLoggedIn(!!uid);
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch recipe");
        }
        const ingredientsArray =
          typeof data.ingredients === "string"
            ? data.ingredients.split("|").map((ing: string) => ing.trim())
            : data.ingredients;
        const instructionsArray =
          typeof data.instructions === "string"
            ? data.instructions
                .split(".")
                .map((step: string) => step.trim())
                .filter((step: string) => step.length > 0)
            : data.instructions;
        setRecipe({ ...data, ingredients: ingredientsArray, instructions: instructionsArray });
      } catch (err: any) {
        console.error("Error fetching recipe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}/ratings`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setAverageRating(Number(data.average_rating));
        }
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}/comments`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setComments(data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchRecipe();
    fetchAverageRating();
    fetchComments();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/");
  };

  // Go Back handler.
  const handleBack = () => {
    router.back();
  };

  // Favorite toggle functionality.
  const handleToggleFavorite = async () => {
    const uid = localStorage.getItem("user_id");
    if (!uid || !recipe?.id) {
      console.error("Missing user_id or recipe_id");
      return;
    }
    try {
      const endpoint = isFavorited
        ? `${process.env.NEXT_PUBLIC_API_URL}/recipes/remove-favorite`
        : `${process.env.NEXT_PUBLIC_API_URL}/recipes/save-favorite`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(uid), recipe_id: recipe.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update favorite");
      setIsFavorited(!isFavorited);
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleRatingSubmit = async (selectedRating: number) => {
    const uid = localStorage.getItem("user_id");
    if (!uid || !recipe?.id) {
      console.error("User ID or recipe ID is missing");
      return;
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}/rate`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(uid), rating: selectedRating }),
      });
      if (response.ok) {
        setRating(selectedRating);
        const avgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}/ratings`);
        const avgData = await avgRes.json();
        setAverageRating(Number(avgData.average_rating));
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit rating");
      }
    } catch (err: any) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleCommentSubmit = async () => {
    const uid = localStorage.getItem("user_id");
    if (!uid || !newComment.trim()) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}/comment`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(uid), comment_text: newComment }),
      });
      const data = await response.json();
      if (response.ok) {
        setComments([data, ...comments]);
        setNewComment("");
      } else {
        throw new Error(data.message || "Failed to post comment");
      }
    } catch (err: any) {
      console.error("Error posting comment:", err);
    }
  };

  const handleEditComment = async (commentId: number) => {
    const uid = localStorage.getItem("user_id");
    if (!uid) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/comments/${commentId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(uid), comment_text: editingCommentText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update comment");
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, comment_text: editingCommentText } : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err: any) {
      console.error("Error updating comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const uid = localStorage.getItem("user_id");
    if (!uid) return;
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/recipes/comments/${commentId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(uid) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete comment");
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      console.error("Error deleting comment:", err);
    }
  };

  // Render rating section.
  const renderRatingSection = () => (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Rate this Recipe</h2>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() =>
              isLoggedIn
                ? handleRatingSubmit(star)
                : console.warn("User must be logged in to rate")
            }
            className="focus:outline-none"
            disabled={!isLoggedIn}
          >
            <Star
              className={`w-8 h-8 cursor-pointer transition duration-300 ${
                star <= (rating || averageRating || 0) ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {!isLoggedIn && (
        <p className="text-gray-500 text-sm mt-2">Log in to rate this recipe.</p>
      )}
    </div>
  );

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!recipe) return <p className="text-center text-gray-500">Recipe not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100"
    >
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 bg-white shadow-lg rounded-2xl relative mt-8 mb-8">
        <button
          onClick={handleBack}
          className="bg-purple-500 text-white px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base rounded hover:bg-purple-600 absolute top-4 right-4 z-30"
        >
          Go Back
        </button>
                
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 text-center"
        >
          {recipe.name}
        </motion.h1>
          <div className="relative w-full h-80">
          {recipe.video_url ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <iframe
                src={recipe.video_url.replace("watch?v=", "embed/")}
                title={recipe.name}
                allowFullScreen
                className="w-full h-full rounded-lg shadow-md"
              />
            </motion.div>
          ) : (
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src="/placeholder.svg"
              alt={recipe.name}
              className="w-full h-80 object-cover rounded-lg shadow-md"
            />
          )}
          {/* Add to Favourite (Heart) Button */}
          {isLoggedIn && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 left-3 z-20 text-red-500 hover:text-red-600 transition"
            >
              <Heart className={`h-7 w-7 ${isFavorited ? "fill-red-500" : ""}`} />
            </button>
          )}
          {/* Average rating badge */}
          <div className="absolute top-3 right-3 z-20 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white ml-1">
              {averageRating ?? 0}
            </span>
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-700 text-lg mt-6 text-center"
        >
          {recipe.description}
        </motion.p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {recipe.ingredients.map((ingredient, index) => (
              <motion.span
                key={index}
                className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg text-lg font-semibold shadow-sm"
                whileHover={{ scale: 1.1 }}
              >
                {ingredient}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="bg-gray-50 p-5 rounded-lg shadow-md flex items-start space-x-4"
              >
                <div className="bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{instruction}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {renderRatingSection()}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Comments</h2>
          {isLoggedIn && (
            <div className="mb-4 flex flex-col items-center">
              <textarea
                className="w-full p-3 border rounded-md"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition mt-2"
              >
                Post Comment
              </button>
            </div>
          )}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm font-semibold">{comment.username}</p>
                {editingCommentId === comment.id ? (
                  <div>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                    />
                    <div className="mt-2 space-x-2 flex justify-center">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentText("");
                        }}
                        className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{comment.comment_text}</p>
                    {isLoggedIn &&
                      localStorage.getItem("user_id") === String(comment.user_id) && (
                        <div className="mt-2 space-x-2 flex justify-center">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingCommentText(comment.comment_text);
                            }}
                            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
              </div>
              <Footer />
            </motion.div>
          );
        }
