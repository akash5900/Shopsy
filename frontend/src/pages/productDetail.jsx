import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import { FaStar, FaShoppingCart, FaBolt } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMiniShieldCheck } from "react-icons/hi2";
import useCart from "../context/useCart";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCart } = useCart();
  const [product, setProduct] = useState(null);
  const [moreProducts, setMoreProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  async function getProduct() {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`);

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setProduct(data.product);

      if (data.product?.variants) {
        try {
          const variants =
            typeof data.product.variants === "string"
              ? JSON.parse(data.product.variants)
              : data.product.variants;

          if (variants.length > 0) {
            setSelectedVariant(variants[0]);
          } else {
            setSelectedVariant(null);
          }
        } catch (error) {
          console.log("Invalid variants:", error);
        }
      } else {
        setSelectedVariant(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getMoreProducts() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/products/allproducts?page=1&limit=30",
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      const filteredProducts = (data.products || []).filter(
        (item) => item._id !== id,
      );

      setMoreProducts(filteredProducts);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setProduct(null);
    setSelectedVariant(null);

    getProduct();
    getMoreProducts();
  }, [id]);

  let variants = [];

  try {
    variants =
      typeof product?.variants === "string"
        ? JSON.parse(product.variants)
        : product?.variants || [];
  } catch (error) {
    console.log("Invalid variants:", error);
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  function buyNow() {
    navigate("/checkout", {
      state: {
        product,
        price: currentPrice,
        variant: selectedVariant,
        quantity,
      },
    });
  }

  async function addToCart() {
    try {
      const matchingVariant = selectedVariant
        ? variants.find(
            (variant) => String(variant._id) === String(selectedVariant._id),
          )
        : null;

      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product._id,
          quantity,
          variant: matchingVariant,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        navigate("/login");
        return;
      }

      alert(data.message);
      getCart();
    } catch (error) {
      console.log(error);
    }
  }

  const currentPrice = selectedVariant?.price ?? product.price;

  return (
    <div className="min-h-screen bg-gray-50 pt-3 sm:pt-6">
      <div className="px-3 md:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-10 rounded-2xl bg-white p-3 shadow-sm  sm:p-6 md:p-8 2xl:p-10">
          <div className="flex items-center justify-center rounded-xl bg-gray-50 p-3 sm:p-6">
            <img
              src={product.image}
              alt={product.name}
              className="h-[260px] w-full max-w-lg rounded-lg object-contain md:h-[300px] lg:h-[450px]"
            />
          </div>

          <section className="flex min-w-0 flex-col gap-3 lg:ml-15">
            <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs md:text-sm font-medium text-blue-600">
              {product.category?.name || "N/A"}
            </span>

            <h1 className="break-words text-base md:text-xl lg:text-2xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-white">
                <span className="text-sm font-medium">
                  {product.ratings || 0}
                </span>

                <FaStar className="text-xs" />
              </div>

              <span className="text-xs md:text-sm lg:text-sm text-gray-500">Customer Rating</span>
            </div>

            <div className="flex items-center ">
              <BiRupee className="text-base md:text-xl lg:text-3xl text-gray-900" />

              <span className="text-base md:text-xl lg:text-3xl font-bold text-gray-900">
                {currentPrice}
              </span>
            </div>

            <div className="border-t border-gray-200" />

            <div>
              <p className="break-words leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            {variants.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold">Select Variant</h2>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`rounded-xl border px-3 py-3 transition sm:px-4 ${
                        selectedVariant?._id === variant._id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <div className="font-medium">{variant.size}</div>

                      <div className="text-sm text-gray-500">
                        {variant.color}
                      </div>

                      <div className="text-sm font-semibold">
                        ₹{variant.price}
                      </div>

                      <div className="text-xs text-gray-500">
                        Stock: {variant.stock}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-3">
              <div className="flex items-center gap-1">
                <TbTruckDelivery color="green" />

                <h1 className="text-[13px]">Free Delivery</h1>
              </div>

              <div className="flex items-center gap-1">
                <HiMiniShieldCheck color="blue" />

                <h1 className="text-[13px]">1 Year Warranty</h1>
              </div>

              <div className="flex items-center gap-1">
                <FaArrowRotateLeft size={11} color="red" />

                <h1 className="text-[13px]">30-day returns</h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:gap-4">
              <button
                onClick={buyNow}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-600"
              >
                <FaBolt />
                Buy Now
              </button>

              <button
                onClick={addToCart}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                <FaShoppingCart />
                Add To Cart
              </button>
            </div>
          </section>
        </div>

        {moreProducts.length > 0 && (
          <section className=" mt-3 mb-3 md:mt-5 md:mb-5 lg:mb-8 lg:mt-8 sm:ml-2">
            <div className="mb-3 md:mb-5 lg:mb-6 flex items-center justify-between">
              <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-700 ">
                More Products
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 2xl:gap-16">
              {moreProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/productdetail/${item._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="flex min-w-0 cursor-pointer flex-col gap-2 border border-gray-200 px-2 pb-2 pt-3 hover:bg-gray-100 hover:shadow-xl sm:px-4 sm:pt-4 md:w-[230px] lg:w-[270px] 2xl:w-[300px]"
                >
                  <div className="flex justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[100px] w-full rounded object-cover sm:h-[130px] md:h-[150px] 2xl:h-[210px]"
                    />
                  </div>

                  <section className="flex min-w-0 flex-col gap-2 text-gray-700">
                    <div className="flex min-w-0 items-start justify-between gap-1">
                      <h1 className="min-w-0 break-words text-sm font-semibold md:text-md 2xl:text-[15px]">
                        {item.name}
                      </h1>

                      <div className="flex shrink-0 items-center">
                        <BiRupee />

                        <h2 className="font-semibold text-gray-800 md:text-md 2xl:text-md">
                          {item.price}
                        </h2>
                      </div>
                    </div>

                    <p className="mb-1 truncate text-sm md:text-md">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <FaStar size={12} color="orange" />
                        <p className="text-[15px] font-bold">{item.ratings}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <FaArrowRotateLeft size={11} />

                        <h1 className="text-[11px] sm:text-[13px]">
                          30-day returns
                        </h1>
                      </div>
                    </div>
                  </section>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
