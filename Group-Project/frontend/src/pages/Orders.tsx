import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  created_at: string;
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/api/orders/${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => setError("Could not load your orders. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">📦 My Orders</h1>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <FaArrowLeft /> Continue shopping
          </Link>
        </div>

        {loading && (
          <p className="mt-8 text-slate-500">Loading your orders...</p>
        )}

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-gray-50 p-12 text-center">
            <div className="text-5xl">📭</div>
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-slate-500">
              Anything you check out will show up here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-gray-50 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</h3>
                  <span className="text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-slate-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-slate-200 pt-3 font-semibold">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
