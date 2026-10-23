import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <Hero />

      <ProductSection />

      <FeatureSection />

      <div className="flex justify-center py-6">
        <Link
          to="/cart"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          🛒 Go to Cart
        </Link>
      </div>

      <Footer />
    </main>
  );
}