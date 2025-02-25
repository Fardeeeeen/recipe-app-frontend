"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import recipeBg from "@/public/images/recipebg.jpg";

const contactImages = [
  "Bar",
  "Biscuit",
  "Brownie",
  "Cake",
  "Churro",
  "Cookie",
];

export default function ContactPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Check login status.
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/");
  };

  // Handle form changes.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");
      setFeedback("Thank you for contacting us! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      setFeedback(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-pink-100">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <main className="flex-grow">
        {/* About Section */}
        <section className="py-12 px-4" style={{ backgroundColor: "#f9e8f8" }}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3 space-y-8 text-gray-800">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-center lg:text-left"
              style={{ color: "#9d29ff" }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              About DessertAI
            </motion.h1>
              <section>
                <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
                <p className="text-lg">
                  Home cooks are our heroes—it's as simple as that. DessertAI is a vibrant community built by and for kitchen experts. Whether you’re perfecting a showstopping dessert or enjoying a quick treat on a busy night, our platform inspires, connects, and empowers every cook.
                </p>
                <p className="text-lg">
                  We connect passionate dessert enthusiasts with their greatest source of inspiration—other home cooks.
                </p>
              </section>
              <section>
                <h2 className="text-3xl font-semibold mb-4">Our History</h2>
                <p className="text-lg">
                  Founded in 1997 as SweetInspiration.com, DessertAI revolutionized the way home cooks share recipes and tips. Over the years, we have grown into a global community.
                </p>
              </section>
              <section>
                <h2 className="text-3xl font-semibold mb-4">The DessertAI Community</h2>
                <p className="text-lg">
                  Cooks around the world share cherished recipes, creative ideas, and personal tips on our platform.
                </p>
              </section>
              <section>
                <h2 className="text-3xl font-semibold mb-4">Editorial Excellence & Guidelines</h2>
                <p className="text-lg">
                  Our team of culinary experts, photographers, and editors meticulously tests and refines every recipe.
                </p>
              </section>
              <section>
                <h2 className="text-3xl font-semibold mb-4">Diversity and Inclusion</h2>
                <p className="text-lg">
                  We celebrate diverse culinary traditions and ensure that our content reflects the rich mosaic of our community.
                </p>
              </section>
              <section>
                <h2 className="text-3xl font-semibold mb-4">DessertAI Magazine</h2>
                <p className="text-lg">
                  Launched in 2013, our magazine delivers seasonal recipes, expert advice, and the latest trends to dessert lovers worldwide.
                </p>
              </section>
              <section>
                <h2 className="text-3xl font-semibold mb-4">Community Guidelines</h2>
                <p className="text-lg">
                  We value constructive feedback and respectful sharing—ensuring DessertAI remains a welcoming space.
                </p>
              </section>
            </div>

            {/* Right Column: Vertical Image Stack (hidden on mobile) */}
            <div className="lg:w-1/3 hidden lg:flex flex-col items-center space-y-6">
              {contactImages.map((cat, index) => {
                const imgSlug = cat.toLowerCase().replace(/\s+/g, "-");
                const imgUrl = `/images/categories/${imgSlug}.jpg`;
                return (
                  <motion.img
                    key={index}
                    src={imgUrl}
                    alt={cat}
                    className="w-48 h-48 object-cover rounded-full shadow-xl"
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Community & Work With Us Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800" style={{ color: "#fbe7f5" }}>
                Connect With Our Community
              </h2>
              <p className="text-gray-700 text-lg mt-4" style={{ color: "#19032d" }}>
                Join millions of dessert enthusiasts who share their creations, reviews, and culinary tips.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Contact Information */}
              <div className="p-8 rounded-lg shadow-lg space-y-4" style={{ backgroundColor: "#f9e8f8" }}>
                <h3 className="text-3xl font-bold text-gray-800">Contact Information</h3>
                <p className="text-lg text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:support@dessertai.com" className="text-[#ad54f0] hover:underline">
                    support@dessertai.com
                  </a>
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Phone:</strong> (800) 123-4567
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Address:</strong> 123 Sweet Street, Dessert City, DC 12345
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Social:</strong> Follow us on Facebook, Instagram, Pinterest, and YouTube.
                </p>
              </div>
              {/* Work With Us */}
              <div className="p-8 rounded-lg shadow-lg space-y-4" style={{ backgroundColor: "#fbe7f5" }}>
                <h3 className="text-3xl font-bold text-gray-800">Work With Us</h3>
                <p className="text-lg text-gray-700">
                  Join our team of enthusiastic editors, designers, programmers, and recipe developers as we build the world's largest dessert site.
                </p>
                <p className="text-lg text-gray-700">
                  Interested?{" "}
                  <a href="/contact" className="text-[#ad54f0] hover:underline">
                    View job openings here
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section
          className="py-12 px-4"
          style={{ backgroundImage: `url(${recipeBg.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="max-w-4xl mx-auto bg-gray-50 shadow-xl rounded-lg p-8" style={{ backgroundColor: "#f9e8f8" }}>
            <motion.h2
              className="text-4xl font-bold text-gray-800 mb-4 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              className="text-gray-700 text-center mb-8 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              For inquiries, support, or feedback, please fill out the form below.
            </motion.p>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-800 mb-2 font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-800 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-800 mb-2 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-800 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              {feedback && (
                <p className="text-center text-lg text-green-600">{feedback}</p>
              )}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full hover:from-purple-600 hover:to-pink-600 transition"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </motion.form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
