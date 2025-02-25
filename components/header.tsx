"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const Header = ({ isLoggedIn, handleLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 cursor-pointer">
            DessertAI
          </h1>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <Link
                href="/recent-searches"
                className="text-gray-700 hover:text-purple-600 font-semibold transition"
              >
                Recent Searches
              </Link>
              <Link
                href="/favorites"
                className="text-gray-700 hover:text-pink-600 font-semibold transition"
              >
                Your Favorites
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition">
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-md shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/recent-searches"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-purple-600 font-semibold transition"
                >
                  Recent Searches
                </Link>
                <Link
                  href="/favorites"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-pink-600 font-semibold transition"
                >
                  Your Favorites
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-purple-600 font-semibold transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-pink-600 font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
