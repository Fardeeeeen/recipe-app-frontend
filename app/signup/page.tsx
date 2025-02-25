"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import backgroundImage from "../../public/images/loginbg.jpg";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    // Strong password: minimum 8 characters, at least one uppercase, one lowercase, one digit, and one special character.
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setMessage("❌ Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      setMessage("✅ Signup successful! You can now log in.");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });

      // Redirect to login page after signup
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        {message && <p className="text-center text-sm mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            Back to Home
          </Link>
          <Link href="/login" className="text-purple-500 hover:text-purple-600">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
