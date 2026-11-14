import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaHeart } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { IoMdCart } from "react-icons/io";
import { IoBagHandle } from "react-icons/io5";
import { SiShopify } from "react-icons/si";
import useAuth from "../context/useAuth";
import useCart from "../context/useCart";
import useWishlist from "../context/useWishlist";
import Category from "../components/categorys";

export default function Header() {
  const { user, loading } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params, { replace: true });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestion([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          search: search.trim(),
          limit: "5",
          page: "1",
        });

        const res = await fetch(
          `http://localhost:3000/api/products/allproducts?${params.toString()}`,
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not fetch suggestions");
        }

        if (!cancelled) {
          setSuggestion(data.products || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Search suggestions error:", error);
          setSuggestion([]);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <header className="pt-2">
      <div className="shadow-xs border rounded-2xl border-gray-200 mx-2 md:mx-4  2xl:mx-6 ">
        <div className="px-2 pb-2 md:px-4 md:py-2 xl:px-6 xl:py-3 2xl:px-8 2xl:py-4 flex flex-wrap items-center justify-between gap-1 md:gap-2 lg:gap-4 ">
          <Link to="/" className="flex items-center gap-0.5 md:gap-2 shrink-0">
            <SiShopify className="text-gray-900 text-sm md:text-2xl lg:text-3xl" />
            <h1 className="text-sm md:text-xl lg:text-2xl text-gray-900 font-bold">
              Shopsy
            </h1>
          </Link>

          <div className="relative order-3 md:order-none w-full md:flex-1 w-[100px] md:max-w-[500px] md:mx-6">
            <FaSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (search.trim()) setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-1 md:py-1.5 lg:py-2.5 pl-9 pr-3 text-xs md:text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />

            {showSuggestions && search.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {suggestion.length > 0 ? (
                  suggestion.map((product) => (
                    <Link
                      key={product._id}
                      to={`/productdetail/${product._id}`}
                      onClick={() => {
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-3 border-b border-gray-100 p-3 last:border-b-0 hover:bg-gray-50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 shrink-0 rounded-md object-contain"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="mt-1 font-semibold text-blue-600">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500">
                    No matching products found.
                  </p>
                )}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-1 md:gap-4 lg:gap-5 text-gray-900">
            <Link
              to="/cart"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-1 hover:text-blue-600 mr-1"
            >
              <IoMdCart className="mt-1 text-sm md:text-2xl" />
              {totalItems !== 0 ? (
                <span className="text-blue-800">{totalItems}</span>
              ) : (
                <span></span>
              )}
            </Link>

            <Link
              to="/wishlist"
              onClick={() => window.scrollTo(0, 0)}
              aria-label="Wishlist"
              className="relative flex items-center gap-1 hover:text-red-500 mr-1"
            >
              <FaHeart className="mt-1 text-sm md:text-xl" />
              {wishlistCount > 0 && (
                <span className="text-blue-800 text-xs md:text-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-1 hover:text-green-600"
            >
              <IoBagHandle className="text-sm md:text-2xl mt-0.5 " />
            </Link>

            {!loading &&
              (user ? (
                <Link
                  to="/profile"
                  onClick={() => window.scrollTo(0, 0)}
                  className="flex items-center gap-1 md:gap-2 rounded-lg px-3 py-2 hover:text-orange-600 "
                >
                  <BsPersonCircle className="text-sm md:text-2xl mt-1 md:mt-1" />
                  <span className="font-semibold text-sm mt-1">
                    {user.username}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:text-red-500 mt-1"
                >
                  <BsPersonCircle className="text-sm md:text-2xl" />
                  <span className="font-semibold text-sm">Login</span>
                </Link>
              ))}
          </nav>
        </div>
        <div>
          <Category />
        </div>
      </div>
    </header>
  );
}
