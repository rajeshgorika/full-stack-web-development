import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-gray-50 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-blue-500">
      <Link to={`/product/${product.id}`}>
        <ProductImage
          name={product.name}
          category={product.category}
          className="h-48 w-full transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-blue-400">
          {product.category}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 text-lg font-semibold hover:text-blue-400">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              added ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {added ? <FaCheck /> : <FaShoppingCart />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
