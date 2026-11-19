import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import { FaStar, FaHeart } from "react-icons/fa";
import useWishlist from "../context/useWishlist";
import { FaArrowRotateLeft } from "react-icons/fa6";
import ProductsFilters from "../components/productsFilters";

function ProductSkeleton() {
  return (
    <div className="w-full md:w-[270px] 2xl:w-[300px] border border-gray-200 flex flex-col gap-2 p-2 md:p-4">
      <div className="flex justify-center">
        <div className="w-full h-[110px] sm:h-[130px] md:h-[150px] 2xl:h-[180px] rounded bg-gray-200 shimmer" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="h-6 w-3/4 rounded bg-gray-200 shimmer" />
            <div className="h-5 w-1/3 rounded bg-gray-200 shimmer" />
            <div className="h-4 w-full rounded bg-gray-200 shimmer" />
            <div className="h-4 w-5/6 rounded bg-gray-200 shimmer" />
            <div className="h-4 w-2/3 rounded bg-gray-200 shimmer" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Categoryproducts() {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);
  const controllerRef = useRef(null);

  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Track which category/filter combination is currently displayed.
  const filterKey = JSON.stringify([id, search, minPrice, maxPrice]);

  const activeFilterRef = useRef(filterKey);
  const previousFilterRef = useRef(filterKey);

  // Reset pagination synchronously when filters change.
  // This avoids fetching page 3 using newly selected filters.
  if (activeFilterRef.current !== filterKey) {
    activeFilterRef.current = filterKey;
  }

  const filtersChanged = previousFilterRef.current !== filterKey;

  const currentPage = filtersChanged ? 1 : page;
  const visibleProducts = filtersChanged ? [] : products;
  const currentHasMore = filtersChanged ? true : hasMore;

  useEffect(() => {
    if (previousFilterRef.current !== filterKey) {
      previousFilterRef.current = filterKey;

      controllerRef.current?.abort();
      loadingRef.current = false;

      setProducts([]);
      setPage(1);
      setHasMore(true);
      setError("");
      setLoading(true);
    }
  }, [filterKey]);

  // Fetch the current page.
  useEffect(() => {
    if (!id || filtersChanged) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    loadingRef.current = true;

    let active = true;

    async function getProducts() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("category", id);
        params.set("page", String(page));
        params.set("limit", "15");

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (minPrice !== "") {
          params.set("minPrice", minPrice);
        }

        if (maxPrice !== "") {
          params.set("maxPrice", maxPrice);
        }

        const res = await fetch(
          `http://localhost:3000/api/products/category?${params.toString()}`,
          { signal: controller.signal },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch category products");
        }

        if (!active) return;

        const newProducts = data.products || [];

        setProducts((prev) => {
          if (page === 1) {
            return newProducts;
          }

          const existingIds = new Set(prev.map((product) => product._id));

          const uniqueProducts = newProducts.filter(
            (product) => !existingIds.has(product._id),
          );

          return [...prev, ...uniqueProducts];
        });

        setHasMore(Boolean(data.hasMore));
      } catch (error) {
        if (error.name === "AbortError" || !active) return;

        console.error("Error fetching category products:", error);

        setError(error.message || "Failed to load products");
        setHasMore(false);
      } finally {
        if (active) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    }

    getProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, search, minPrice, maxPrice, page, filtersChanged]);

  // Same IntersectionObserver approach as your Home Products page.
  useEffect(() => {
    const currentRef = loadMoreRef.current;

    if (!currentRef || !currentHasMore || loading || error || filtersChanged) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          observer.disconnect();
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [currentHasMore, loading, error, filtersChanged]);

  return (
    <div className="flex flex-col gap-3 md:gap-3 2xl:gap-6 pt-3 md:pt-4 pb-17">
      <div>
        <ProductsFilters />
      </div>

      <div className="flex items-center justify-between gap-2 px-3 md:px-4 2xl:px-8">
        <h1 className="text-base sm:text-lg md:text-xl 2xl:text-2xl text-gray-900 font-semibold min-w-0">
          {visibleProducts[0]?.category?.name || "Category"} Products
        </h1>

        <button
          className="text-sm sm:text-base md:text-lg hover:text-blue-600 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

      <div className="px-3 md:px-4 2xl:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 lg:gap-x-17 lg:gap-y-10 xl:gap-12 2xl:gap-18">
        {loading && visibleProducts.length === 0
          ? Array.from({ length: 15 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : visibleProducts.map((product) => (
              <div
                className="relative w-full min-w-0 md:w-[230px] lg:w-[270px] xl:w-[280px] 2xl:w-[300px] cursor-pointer border border-gray-200 flex flex-col gap-2 hover:bg-gray-100 hover:shadow-xl p-2 md:p-4"
                key={product._id}
                onClick={() => {
                  navigate(`/productdetail/${product._id}`);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <button
                  type="button"
                  aria-label={
                    isWishlisted(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                >
                  <FaHeart
                    className={
                      isWishlisted(product._id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }
                  />
                </button>

                <div className="flex justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[110px] sm:h-[130px] md:h-[150px] 2xl:h-[210px] w-full object-contain rounded"
                  />
                </div>

                <section className="flex flex-col gap-2 text-gray-700 min-w-0">
                  <div className="flex justify-between gap-1">
                    <h2 className="text-xs sm:text-sm md:text-md 2xl:text-[15px] font-semibold min-w-0">
                      {product.name}
                    </h2>

                    <div className="flex items-center shrink-0">
                      <BiRupee className="text-xs sm:text-sm md:text-base" />

                      <h3 className="text-xs sm:text-sm md:text-md 2xl:text-md font-semibold text-gray-800">
                        {product.price}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-xs md:text-md truncate mb-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <FaStar size={12} color="orange" />
                      <p className="text-xs md:text-[15px] font-bold">
                        {product.ratings}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <FaArrowRotateLeft size={11} />
                      <p className="text-[9px] sm:text-[11px] md:text-[13px] whitespace-nowrap">
                        30-day returns
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            ))}

        {/* Show skeletons without hiding existing products */}
        {loading &&
          visibleProducts.length > 0 &&
          Array.from({ length: 5 }).map((_, index) => (
            <ProductSkeleton key={`loading-${index}`} />
          ))}
      </div>

      {!loading && !error && visibleProducts.length === 0 && (
        <p className="text-center text-gray-600 py-8 text-sm md:text-base">
          No products found matching your filters.
        </p>
      )}

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {currentHasMore && !error && (
        <div ref={loadMoreRef} className="flex justify-center mt-8 h-10">
          {loading && <p className="text-gray-500">Loading more products...</p>}
        </div>
      )}

      {!currentHasMore && visibleProducts.length > 0 && (
        <p className="text-center text-gray-500 mt-8">No more products</p>
      )}
    </div>
  );
}

export default Categoryproducts;
