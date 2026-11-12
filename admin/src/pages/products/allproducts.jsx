
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Allproducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);

  async function getProducts(pageNumber) {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/products/allproducts?page=${pageNumber}&limit=12`,
      );

      const data = await res.json();

      setProducts((prevProducts) => [...prevProducts, ...data.products]);

      setHasMore(data.hasMore);
    } catch (error) {
      console.log(error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts(1);
  }, []);

  async function dltProduct(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Product deleted");

      setProducts([]);
      setPage(1);
      setHasMore(true);

      await getProducts(1);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (enteries) => {
        const firstEntry = enteries[0];

        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !loading &&
          !loadingRef.current
        ) {
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
    <div className="space-y-4 text-gray-900">
      <div className="flex flex-wrap justify-between items-center gap-3 text-lg sm:text-xl font-semibold">
        <h1>All Products</h1>

        <Link
          to={"/admin/addproduct"}
          className="cursor-pointer text-blue-600 hover:text-blue-800 text-base sm:text-lg"
        >
          +Add Product
        </Link>
      </div>

      <div className="w-full overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full min-w-[750px] border border-gray-200 border-collapse table-fixed">
          <thead className="bg-blue-200">
            <tr className="text-base sm:text-lg pl-1">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 md:text-left">Description</th>
              <th className="p-2 text-center">Edit</th>
              <th className="p-2 text-center">Delete</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-200 font-semibold"
              >
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-14 md:w-20 2xl:w-25 md:h-15 2xl:h-18 object-contain rounded my-4 ml-2"
                  />
                </td>

                <td className="p-3 align-middle text-sm md:text-sm 2xl:text-md">
                  {product.name}
                </td>

                <td className="p-3 align-middle text-sm md:text-sm 2xl:text-md">
                  {product.price}
                </td>

                <td className="p-3 align-middle break-words text-xs md:text-xs 2xl:text-sm">
                  {product.description}
                </td>

                <td className="p-3 align-middle text-center">
                  <Link
                    to={`/admin/updateproduct/${product._id}`}
                    className="border border-gray-800 px-2 rounded hover:bg-blue-300 cursor-pointer"
                  >
                    Edit
                  </Link>
                </td>

                <td className="p-3 align-middle text-center">
                  <button
                    onClick={() => dltProduct(product._id)}
                    className="border border-gray-800 px-2 rounded hover:bg-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8 h-10">
          {loading && (
            <p className="text-gray-500 text-sm sm:text-base">
              Loading more products...
            </p>
          )}
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-gray-500 mt-6">
          No more products
        </p>
      )}
    </div>
  );
}
