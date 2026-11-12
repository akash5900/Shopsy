import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ProductsFilters() {
  const [minprice, setMinprice] = useState("");
  const [maxprice, setMaxprice] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  function applyFilter() {
    const params = new URLSearchParams(searchParams);

    if (minprice !== "") {
      params.set("minPrice", minprice);
    } else {
      params.delete("minPrice");
    }

    if (maxprice !== "") {
      params.set("maxPrice", maxprice);
    } else {
      params.delete("maxPrice");
    }

    setSearchParams(params);
  }

  function clearFilter() {
    setMinprice("");
    setMaxprice("");

    const params = new URLSearchParams(searchParams);
    params.delete("minPrice");
    params.delete("maxPrice");

    setSearchParams(params);
  }
  
  return (
    <div>
      <div className="px-2 md:px-4 2xl:px-6 pb-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 border border-gray-200 rounded-xl bg-gray-50 p-3 md:px-4">
          <div className="flex items-center gap-2 mr-2">
            <FaFilter size={14} className="text-gray-600" />
            <h2 className="font-semibold text-sm text-gray-700">
              Filter Products
            </h2>
          </div>

          <input
            type="number"
            value={minprice}
            onChange={(e) => setMinprice(e.target.value)}
            placeholder="₹ Min Price"
            className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 w-30 md:w-[140px] bg-white text-xs md:text-sm outline-none focus:border-blue-400"
          />

          <input
            type="number"
            value={maxprice}
            onChange={(e) => setMaxprice(e.target.value)}
            placeholder="₹ Max Price"
            className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 w-32 md:w-[140px] bg-white text-sm outline-none focus:border-blue-400"
          />

          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={applyFilter}
              className="bg-blue-600 text-white rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-[7px] md:text-sm hover:bg-blue-700 flex-1 sm:flex-none"
            >
              Apply Filter
            </button>

            <button
              onClick={clearFilter}
              className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 md:px-4 text-[7px] md:text-sm hover:bg-gray-100 flex-1 sm:flex-none"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
