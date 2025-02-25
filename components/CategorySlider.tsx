"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  "Bar",
  "Biscuit",
  "Brownie",
  "Cake",
  "Churro",
  "Cookie",
  "Cream Puff",
  "Crumble",
  "Custard",
  "Doughnut",
  "Fudge",
  "Macaron",
  "Meringue",
  "Mousse",
  "Muffin",
  "Parfait",
  "Pastry",
  "Pavlova",
  "Pie",
  "Pudding",
  "Soufflé",
  "Tart",
  "Truffle",
  "Éclair"
];

interface CategorySliderProps {
  onSelectCategory: (category: string) => void;
}

export default function CategorySlider({ onSelectCategory }: CategorySliderProps) {
  // itemsPerSlide will be determined based on window width
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);

  // itemsPerSlide based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerSlide(1);
      } else if (width < 768) {
        setItemsPerSlide(2);
      } else if (width < 1024) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const getWidthClass = () => {
    switch (itemsPerSlide) {
      case 1:
        return "w-full";
      case 2:
        return "w-1/2";
      case 3:
        return "w-1/3";
      case 4:
      default:
        return "w-1/4";
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto group mb-16">
     <h2 className="text-[1.6rem] sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-gray-800 lilita-one-regular" style={{ color: "#19032d" }}>
        Explore Our Recipe Categories
      </h2>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {categories.map((category, index) => {
            const slug = category.toLowerCase().replace(/\s+/g, "-");
            return (
              <motion.div
                key={index}
                className={`${getWidthClass()} flex-shrink-0 px-2`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => onSelectCategory(category)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105 cursor-pointer relative">
                  <img
                    src={`/images/categories/${slug}.jpg`}
                    alt={category}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white lilita-one-regular">
                      {category}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-80 transition hidden group-hover:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-80 transition hidden group-hover:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
