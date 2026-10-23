import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { PRODUCTS } from "../data/products";
import RecommendationCard, {
  type RecommendationData,
} from "../components/RecommendationCard";

export default function Recommendations() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id);

  const [recommendations, setRecommendations] = useState<
    RecommendationData[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = async (productId: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:5000/api/recommendations/${productId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();

      setRecommendations(data.recommendations);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the recommendation server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(selectedProduct);
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Recommendation Engine
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Discover Products You May Like
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Our recommendation engine analyzes customer purchase patterns
            using association rule mining.
          </p>
        </div>

        {/* Product Selection */}
        <section className="rounded-2xl border border-slate-200 bg-gray-50 p-6">
          <label className="mb-3 block text-sm text-slate-500">
            Select a product
          </label>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full max-w-xl rounded-xl border border-slate-300 bg-gray-100 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          >
            {PRODUCTS.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </section>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center">
            <div className="text-4xl">🤖</div>
            <p className="mt-4 text-blue-400">
              Analyzing customer purchase patterns...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {/* Recommendations */}
        {!loading && !error && recommendations.length > 0 && (
          <section className="mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Customers Also Bought</h2>
              <p className="mt-1 text-slate-500">
                Products frequently purchased with{" "}
                <span className="text-blue-400">
                  {
                    PRODUCTS.find((p) => p.id === selectedProduct)?.name
                  }
                </span>
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={`${rec.name}-${index}`}
                  recommendation={rec}
                />
              ))}
            </div>
          </section>
        )}

        {/* No recommendations */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-gray-50 p-10 text-center">
            <div className="text-5xl">🔍</div>
            <h2 className="mt-4 text-xl font-semibold">
              No recommendations found
            </h2>
            <p className="mt-2 text-slate-500">
              There are not enough purchase relationships for this product
              yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
