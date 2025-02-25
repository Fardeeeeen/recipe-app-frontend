"use client";

import { useModal } from "./GlobalModalProvider";

const Footer = () => {
  const { openModal } = useModal();

  return (
    <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
      <div className="container mx-auto text-center px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
          <button
            onClick={() => openModal("privacy")}
            className="cursor-pointer text-gray-200 hover:text-white transition text-xs sm:text-base"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => openModal("terms")}
            className="cursor-pointer text-gray-200 hover:text-white transition text-xs sm:text-base"
          >
            Terms of Service
          </button>
          <a
            href="/contact"
            className="text-gray-200 hover:text-white transition text-xs sm:text-base"
          >
            Contact Us
          </a>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} DessertAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
