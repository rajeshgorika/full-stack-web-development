import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { getProductById } from "../data/products";
import ProductImage from "../components/ProductImage";
import RecommendationCard, {
  type RecommendationData,
} from "../components/RecommendationCard";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const product = id ? getProductById(id) : undefined;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [recommendations, setRecommendations] = useState<
    RecommendationData[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`http://127.0.0.1:5000/api/recommendations/${id}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations ?? []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false));
  }, [id]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/" className="mt-4 text-blue-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-32 pb-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gray-50">
            <ProductImage
              name={product.name}
              category={product.category}
              className="h-96 w-full"
              iconClassName="h-1/3 w-1/3"
            />
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-slate-500">{product.description}</p>

            <p className="mt-6 text-3xl font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-3 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 text-lg text-slate-500 hover:text-slate-900"
                >
                  −
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 text-lg text-slate-500 hover:text-slate-900"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                  added ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {added ? <FaCheck /> : <FaShoppingCart />}
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>

            <Link
              to="/cart"
              className="mt-4 inline-block text-sm text-blue-400 hover:underline"
            >
              View cart →
            </Link>
          </div>
        </div>

        {/* Recommendations */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Frequently Bought Together</h2>
          <p className="mt-1 text-slate-500">
            Customers who bought {product.name} also bought these products.
          </p>

          {loading && (
            <p className="mt-6 text-blue-400">Loading recommendations...</p>
          )}

          {!loading && recommendations.length === 0 && (
            <p className="mt-6 text-slate-500">
              No recommendations available for this product yet.
            </p>
          )}

          {!loading && recommendations.length > 0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={`${rec.name}-${index}`}
                  recommendation={rec}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
