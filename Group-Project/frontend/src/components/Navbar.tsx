import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6 px-8 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Smart Shop
        </Link>

        {/* Search */}
        <SearchBar className="hidden md:block w-full max-w-md" />

        {/* Navigation */}
        <nav className="hidden lg:flex gap-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-cyan-400 transition duration-300">
            Home
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-cyan-400 transition duration-300"
          >
            Dashboard
          </Link>

          <Link
            to="/recommendations"
            className="hover:text-cyan-400 transition duration-300"
          >
            Top Picks
          </Link>

          <Link
            to="/admin"
            className="hover:text-cyan-400 transition duration-300"
          >
            Admin
          </Link>
        </nav>

        {/* Auth */}
        {user ? (
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              to="/orders"
              className="text-sm text-slate-700 hover:text-cyan-400"
            >
              My Orders
            </Link>
            <span className="text-sm text-slate-700">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="text-sm text-slate-700 hover:text-cyan-400"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden text-sm text-slate-700 hover:text-cyan-400 sm:block"
          >
            Login
          </Link>
        )}

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex shrink-0 items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 rounded-full hover:scale-105 transition"
        >
          <FaShoppingCart />
          <span className="hidden sm:inline">Cart</span>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-slate-900">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile search */}
      <div className="px-6 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
