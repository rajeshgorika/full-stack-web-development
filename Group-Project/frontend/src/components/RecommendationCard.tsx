import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { FALLBACK_EMOJI, getProductByName, nameToId } from "../data/products";
import ProductImage from "./ProductImage";

export interface RecommendationData {
  name: string;
  score: number;
  support: number;
  confidence: number;
  lift: number;
}

export default function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationData;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = getProductByName(recommendation.name);
  const productId = product?.id ?? nameToId(recommendation.name);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-gray-50 overflow-hidden transition hover:-translate-y-1 hover:border-blue-500">
      <Link to={`/product/${productId}`}>
        {product ? (
          <ProductImage
            name={product.name}
            category={product.category}
            className="h-32 w-full"
            iconClassName="h-1/3 w-1/3"
          />
        ) : (
          <div className="flex h-32 items-center justify-center bg-gray-100">
            <span className="text-5xl">{FALLBACK_EMOJI}</span>
          </div>
        )}
      </Link>

      <div className="p-6">
        <Link to={`/product/${productId}`}>
          <h3 className="text-xl font-semibold hover:text-blue-400">
            {recommendation.name}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-slate-500">
          Frequently purchased with your selected product.
        </p>

        {/* Score */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-slate-500">Match Score</span>
            <span className="font-semibold text-green-400">
              {recommendation.score}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${Math.min(recommendation.score, 100)}%` }}
            />
          </div>
        </div>

        {/* ML metrics */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-gray-100 p-3 text-center">
            <p className="text-xs text-slate-500">Support</p>
            <p className="mt-1 text-sm font-semibold">
              {recommendation.support}%
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-3 text-center">
            <p className="text-xs text-slate-500">Confidence</p>
            <p className="mt-1 text-sm font-semibold">
              {recommendation.confidence}%
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-3 text-center">
            <p className="text-xs text-slate-500">Lift</p>
            <p className="mt-1 text-sm font-semibold">
              {recommendation.lift}
            </p>
          </div>
        </div>

        {product && (
          <div className="mt-5 flex items-center justify-between">
            <span className="text-lg font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            <button
              onClick={handleAdd}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                added ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {added ? <FaCheck /> : <FaShoppingCart />}
              {added ? "Added" : "Add to cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
