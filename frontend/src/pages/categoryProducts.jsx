import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import ProductsFilters from "../components/productsFilters";

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

function Categoryproducts() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.set("category", id);
        params.set("page", "1");
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
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getProducts();
    }
  }, [id, search, minPrice, maxPrice]);

  return (
    <div className="flex flex-col gap-3 md:gap-3 2xl:gap-6 pt-3 md:pt-4 pb-17">
      <div>
        <ProductsFilters />
      </div>

      <div className="flex items-center justify-between gap-2 px-3 md:px-4 2xl:px-8">
        <h1 className="text-base sm:text-lg md:text-xl 2xl:text-2xl text-gray-900 font-semibold min-w-0">
          {products[0]?.category?.name || "Category Products"} Products
        </h1>

        <button
          className="text-sm sm:text-base md:text-lg hover:text-blue-600 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

      <div className="px-3 md:px-4 2xl:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 gap-6 lg:gap-8 2xl:gap-18">
        {loading ? (
          Array.from({ length: 15 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              className="w-full min-w-0 md:w-[230px] lg:w-[280px] 2xl:w-[300px] cursor-pointer border border-gray-200 flex flex-col gap-2 hover:bg-gray-100 hover:shadow-xl p-2 md:p-4"
              key={product._id}
              onClick={() => navigate(`/productdetail/${product._id}`)}
            >
              <div className="flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[110px] sm:h-[130px] md:h-[150px] 2xl:h-[210px] w-full object-cover rounded"
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
          ))
        ) : (
          <p className="col-span-full text-gray-600 py-8 text-sm md:text-base">
            No products found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default Categoryproducts;
