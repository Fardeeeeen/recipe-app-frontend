"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import backgroundImage from "../../public/images/loginbg.jpg";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      setMessage(data.message);
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"style={{ backgroundImage: `url(${backgroundImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        {message && <p className="text-center text-sm mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md"
          >
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <Link href="/login" className="text-blue-500 hover:text-blue-600">Back to Login</Link>
          <Link href="/" className="text-purple-500 hover:text-purple-600">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
