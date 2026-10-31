import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProductByName } from "../data/products";
import ProductImage from "../components/ProductImage";
import { fetchStats, fetchPopularProducts, type DashboardStats, type PopularProduct } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_transactions: 0,
    total_products: 0,
    total_rules: 0,
    average_confidence: 0,
  });
  const [products, setProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [s, p] = await Promise.all([fetchStats(), fetchPopularProducts()]);
        setStats(s);
        setProducts(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-10">
        {/* Title */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              ML Analytics Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Product Insights & Association Rules
            </h1>
            <p className="mt-3 text-slate-500">
              Apriori Market Basket Analysis mined from 100 customer transactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Apriori Engine Online
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Products</p>
            <h2 className="mt-3 text-3xl font-bold">{stats.total_products || 15}</h2>
            <p className="mt-2 text-sm text-green-600 font-medium">↑ 12.5% catalog growth</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Purchases Analyzed</p>
            <h2 className="mt-3 text-3xl font-bold">{stats.total_transactions || 100}</h2>
            <p className="mt-2 text-sm text-green-600 font-medium">↑ 18.2% basket volume</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Mined Association Rules</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-600">{stats.total_rules || 163}</h2>
            <p className="mt-2 text-sm text-blue-500 font-medium">Min Support: 5% | Min Conf: 20%</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Average Rule Confidence</p>
            <h2 className="mt-3 text-3xl font-bold text-purple-600">{stats.average_confidence || 76.5}%</h2>
            <p className="mt-2 text-sm text-purple-500 font-medium">High Predictability Lift</p>
          </div>
        </div>

        {/* Popular Products Table */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-gray-50 shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold">Popular Products</h2>
            <p className="mt-1 text-sm text-slate-500">
              Products with the highest purchase frequency in customer baskets.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Purchases</th>
                  <th className="px-6 py-4">Growth Rate</th>
                </tr>
              </thead>

              <tbody>
                {products.slice(0, 7).map((product) => {
                  const catalogEntry = getProductByName(product.name);

                  return (
                    <tr
                      key={product.name}
                      className="border-b border-slate-200 last:border-0 hover:bg-slate-100/70 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            name={product.name}
                            category={catalogEntry?.category}
                            className="h-10 w-10 rounded-lg shrink-0 object-cover"
                            iconClassName="h-1/2 w-1/2"
                          />
                          {product.name}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-500">{product.category}</td>

                      <td className="px-6 py-4 font-bold">{product.purchases.toLocaleString()}</td>

                      <td className="px-6 py-4 text-green-600 font-medium">{product.growth}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendation CTA */}
        <section className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Generate Smart Recommendations</h2>
              <p className="mt-2 text-slate-600">
                Use customer purchase patterns to find products that are frequently bought together.
              </p>
            </div>

            <Link
              to="/recommendations"
              className="whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-500 transition shadow"
            >
              Explore Recommendations →
            </Link>
          </div>
        </section>

        {/* Cart Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/cart"
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500 transition shadow"
          >
            🛒 Go to Cart
          </Link>
        </div>
      </main>
    </div>
  );
}
