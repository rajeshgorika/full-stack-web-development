import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProductByName } from "../data/products";
import ProductImage from "../components/ProductImage";
interface Stats {
  total_transactions: number;
  total_products: number;
  total_rules: number;
  average_confidence: number;
}

interface Product {
  name: string;
  category: string;
  purchases: number;
  growth: string;
}
export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
  total_transactions: 0,
  total_products: 0,
  total_rules: 0,
  average_confidence: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {

  // Fetch dashboard statistics
  fetch("http://127.0.0.1:5000/api/stats")
    .then((res) => res.json())
    .then((data) => setStats(data))
    .catch((err) => console.error(err));

  // Fetch popular products
  fetch("http://127.0.0.1:5000/api/popular-products")
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.error(err));

    }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">

      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-10">

        {/* Title */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Analytics Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Product Insights
          </h1>

          <p className="mt-3 text-slate-500">
            Monitor customer purchases and discover product relationships.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6">
            <p className="text-sm text-slate-500">
              Total Products
            </p>

            <h2 className="mt-3 text-3xl font-bold">
             {stats.total_products}
            </h2>

            <p className="mt-2 text-sm text-green-400">
              ↑ 12.5% this month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6">
            <p className="text-sm text-slate-500">
              Total Purchases
            </p>

            <h2 className="mt-3 text-3xl font-bold">
             {stats.total_transactions}
            </h2>

            <p className="mt-2 text-sm text-green-400">
              ↑ 18.2% this month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6">
            <p className="text-sm text-slate-500">
              Recommendations
            </p>

            <h2 className="mt-3 text-3xl font-bold">
             {stats.total_rules}
            </h2>

            <p className="mt-2 text-sm text-green-400">
              ↑ 21.7% this month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gray-50 p-6">
            <p className="text-sm text-slate-500">
              Recommendation Accuracy
            </p>

            <h2 className="mt-3 text-3xl font-bold">
             {stats.average_confidence}%
            </h2>

            <p className="mt-2 text-sm text-blue-400">
              Model Performance
            </p>
          </div>

        </div>

        {/* Products */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-gray-50">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold">
              Popular Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products with the highest purchase activity.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Purchases
                  </th>

                  <th className="px-6 py-4">
                    Growth
                  </th>
                </tr>
              </thead>

              <tbody>

                {products.slice(0, 5).map((product) => {
                  const catalogEntry = getProductByName(product.name);

                  return (
                  <tr
                    key={product.name}
                    className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-6 py-5 font-medium">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          name={product.name}
                          category={catalogEntry?.category}
                          className="h-10 w-10 rounded-lg shrink-0"
                          iconClassName="h-1/2 w-1/2"
                        />
                        {product.name}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {product.category}
                    </td>

                    <td className="px-6 py-5">
                      {product.purchases.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-green-400">
                      {product.growth}
                    </td>

                  </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        </section>

        {/* Recommendation CTA */}
        <section className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <h2 className="text-2xl font-bold">
                Generate Smart Recommendations
              </h2>

              <p className="mt-2 text-slate-500">
                Use customer purchase patterns to find products
                that are likely to be purchased together.
              </p>
            </div>

            <Link
              to="/recommendations"
              className="whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold hover:bg-blue-500"
            >
              Explore Recommendations →
            </Link>

          </div>

        </section>
       {/* Cart Button */}
     <div className="mt-10 flex justify-center">
  <Link
    to="/cart"
    className="rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500"
  >
    🛒 Go to Cart
  </Link>
</div>
      </main>
    </div>
  );
}