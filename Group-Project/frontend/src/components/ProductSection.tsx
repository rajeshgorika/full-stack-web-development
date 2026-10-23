import { PRODUCTS } from "../data/products";
import ProductCard from "./ProductCard";

export default function ProductSection() {
  return (
    <section className="bg-white px-6 py-20 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Shop the Catalog
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Popular Products
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Browse our full range of products, or search for something
            specific using the search bar above.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
