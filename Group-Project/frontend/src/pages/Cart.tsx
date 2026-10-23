import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductImage from "../components/ProductImage";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const shipping = items.length === 0 ? 0 : totalPrice >= 2000 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setPlacing(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not place order.");
        return;
      }

      setPlaced(true);
      clearCart();
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">🛒 Shopping Cart</h1>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <FaArrowLeft /> Continue shopping
          </Link>
        </div>

        {placed && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-green-400">
            ✅ Order placed successfully! Thank you for shopping with us.
            <div className="mt-3">
              <Link to="/orders" className="text-sm underline hover:text-green-300">
                View my orders
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {!placed && items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-gray-50 p-12 text-center">
            <div className="text-5xl">🛍️</div>
            <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">
              Browse products and add something you like.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!placed && items.length > 0 && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gray-50 p-4"
                >
                  <ProductImage
                    name={item.name}
                    category={item.category}
                    className="h-20 w-20 rounded-xl"
                    iconClassName="h-1/2 w-1/2"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-2 text-slate-500 hover:text-slate-900"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="w-6 text-center">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-2 text-slate-500 hover:text-slate-900"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  <p className="w-24 text-right font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-gray-50 p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={placing}
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
              >
                {placing ? "Placing order..." : "Checkout"}
              </button>

              <button
                onClick={clearCart}
                className="mt-3 w-full rounded-xl border border-slate-300 px-6 py-3 text-sm text-slate-700 hover:bg-gray-100"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
