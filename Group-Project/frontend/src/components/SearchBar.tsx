import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { PRODUCTS } from "../data/products";
import ProductImage from "./ProductImage";

export default function SearchBar({
  className = "",
  placeholder = "Search products...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const matches =
    query.trim().length === 0
      ? []
      : PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(query.trim().toLowerCase())
        ).slice(0, 6);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProduct = (id: string) => {
    setOpen(false);
    setQuery("");
    navigate(`/product/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches.length > 0) {
      goToProduct(matches[0].id);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-slate-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500"
        />
      </form>

      {open && matches.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-gray-50 shadow-xl">
          {matches.map((product) => (
            <button
              key={product.id}
              onClick={() => goToProduct(product.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-100"
            >
              <ProductImage
                name={product.name}
                category={product.category}
                className="h-9 w-9 rounded-lg shrink-0"
                iconClassName="h-1/2 w-1/2"
              />
              <span className="flex-1">{product.name}</span>
              <span className="text-slate-500">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length > 0 && matches.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-gray-50 px-4 py-3 text-sm text-slate-500 shadow-xl">
          No products found for "{query}"
        </div>
      )}
    </div>
  );
}
