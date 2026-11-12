
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../context/useWishlist";

function ProductSkeleton() {
  return (
    <div className="w-full md:w-[250px] 2xl:w-[300px] border border-gray-200 flex flex-col gap-2 p-2 md:p-4">
      <div className="flex justify-center">
        <div className="w-full h-[110px] sm:h-[130px] md:h-[150px] 2xl:h-[180px] rounded bg-gray-200 shimmer" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="h-6 w-3/4 rounded bg-gray-200 shimmer" />

          <div className="h-5 w-1/3 rounded bg-gray-200 shimmer" />

          <div className="h-4 w-full rounded bg-gray-200 shimmer" />

          <div className="h-4 w-5/6 rounded bg-gray-200 shimmer" />

          <div className="h-4 w-2/3 rounded bg-gray-200 shimmer" />
        </div>
      </section>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const loadMoreRef = useRef(null);

  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();

  async function getProducts(pageNumber, reset = false) {
    if (loading && !reset) return;

    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      if (minPrice) {
        params.append("minPrice", minPrice);
      }

      if (maxPrice) {
        params.append("maxPrice", maxPrice);
      }

      params.append("page", pageNumber);

      params.append("limit", 15);

      const res = await fetch(
        `http://localhost:3000/api/products/allproducts?${params.toString()}`,
      );

      const data = await res.json();

      if (reset) {
        setProducts(data.products);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);

    getProducts(1, true);
  }, [search, minPrice, maxPrice]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;

          setPage(nextPage);
          getProducts(nextPage);
        }
      },
      {
        rootMargin: "300px",
      },
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [page, hasMore, loading]);

  return (
    <div className="flex flex-col gap-2 md:gap-4 2xl:gap-6 px-2 md:px-4 2xl:px-6 py-3">
      <div>
        <h1 className="text-base md:text-xl xl:text-2xl text-gray-800 font-semibold">
          Products for you
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 lg:gap-15 2xl:gap-18">
        {loading && products.length === 0
          ? Array.from({ length: 15 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
          : products.map((product) => (
            <div
              className="relative w-full min-w-0 md:w-[230px] lg:w-[280px] 2xl:w-[300px] border border-gray-200 flex flex-col gap-2 hover:bg-gray-100 hover:shadow-xl transition px-2 pt-2 pb-1 md:px-4 md:pt-4 md:pb-2 cursor-pointer"
              key={product._id}
              onClick={() => {
                navigate(`/productdetail/${product._id}`);
                window.scrollTo(0, 0);
              }}
            >
              <button
                type="button"
                aria-label={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleWishlist(product._id);
                }}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
              >
                <FaHeart className={isWishlisted(product._id) ? "text-red-500" : "text-gray-400"} />
              </button>
              <div className="flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[110px] sm:h-[130px] md:h-[150px] 2xl:h-[200px] w-full object-contain rounded"
                />
              </div>

              <section className="flex flex-col gap-2 text-gray-700">
                <div className="flex justify-between gap-1">
                  <h1 className="text-[9px] md:text-[14px] 2xl:text-[15px] font-semibold min-w-0">
                    {product.name}
                  </h1>

                  <div className="flex items-center shrink-0">
                    <BiRupee className="text-[9px] md:text-[14px] 2xl:text-[15px]" />

                    <h2 className="text-[9px] md:text-[14px] 2xl:text-[15px] font-semibold text-gray-800">
                      {product.price}
                    </h2>
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs md:text-[13px] 2xl:text-[14px] truncate mb-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <FaStar
                      color="orange"
                      className="text-[9px] md:text-sm"
                    />
                    <p className="text-[9px] md:text-[15px] font-bold">
                      {product.ratings}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaArrowRotateLeft size={11} />

                    <h1 className="text-[9px] md:text-[13px] whitespace-nowrap">
                      30-day returns
                    </h1>
                  </div>
                </div>
              </section>
            </div>
          ))}

        {loading &&
          products.length > 0 &&
          Array.from({ length: 5 }).map((_, index) => (
            <ProductSkeleton key={`loading-${index}`} />
          ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8 h-10">
          {loading && (
            <p className="text-gray-500">Loading more products...</p>
          )}
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-gray-500 mt-8">No more products</p>
      )}
    </div>
  );
}

export default Products;
