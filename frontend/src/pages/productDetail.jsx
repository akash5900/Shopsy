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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");

  async function getProduct() {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`);

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setProduct(data.product);
      setActiveImage(data.product?.image || "");

      if (data.product?.variants) {
        try {
          const variants =
            typeof data.product.variants === "string"
              ? JSON.parse(data.product.variants)
              : data.product.variants;

          if (variants.length > 0) {
            const firstAvailable = variants.find((item) => Number(item.stock) > 0) || variants[0];
            setSelectedVariant(firstAvailable);
            setSelectedColor(firstAvailable.color || "");
            setSelectedSize(firstAvailable.size || "");
            setActiveImage(
              firstAvailable.image ||
              data.product?.images?.[0] ||
              data.product?.image ||
              "",
            );
          } else {
            setSelectedVariant(null);
            setSelectedColor("");
            setSelectedSize("");
          }
        } catch (error) {
          console.log("Invalid variants:", error);
        }
      } else {
        setSelectedVariant(null);
        setSelectedColor("");
        setSelectedSize("");
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
    setSelectedColor("");
    setSelectedSize("");

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

  const galleryImages = product
    ? [...new Set([product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))]
    : [];

  // Group the existing color + size combinations into separate selectors.
  const colorOptions = [...new Map(
    variants.map((variant) => [String(variant.color || "").trim().toLowerCase(), variant])
  ).values()];
  const sizeOptions = [...new Set(variants.map((variant) => variant.size).filter(Boolean))];

  function findVariant(color, size) {
    return variants.find(
      (variant) =>
        String(variant.color).toLowerCase() === String(color).toLowerCase() &&
        String(variant.size).toLowerCase() === String(size).toLowerCase(),
    ) || null;
  }

  function selectColor(color) {
    const sameSizeVariant = findVariant(color, selectedSize);
    const nextVariant = (sameSizeVariant && Number(sameSizeVariant.stock) > 0) ? sameSizeVariant : variants.find(
      (variant) => String(variant.color).toLowerCase() === String(color).toLowerCase() && Number(variant.stock) > 0,
    ) || variants.find(
      (variant) => String(variant.color).toLowerCase() === String(color).toLowerCase(),
    );

    setSelectedColor(color);
    if (nextVariant) {
      setSelectedSize(nextVariant.size || "");
      setSelectedVariant(nextVariant);
      setActiveImage(getVariantImage(nextVariant));
    }
  }

  function selectSize(size) {
    const nextVariant = findVariant(selectedColor, size);
    setSelectedSize(size);
    if (nextVariant) {
      setSelectedVariant(nextVariant);
      setActiveImage(getVariantImage(nextVariant));
    } else {
      setSelectedVariant(null);
    }
  }

  // Older products may not have variant.image saved yet. For those products,
  // use the image in the same position as the variant as a backward-compatible fallback.
  function getVariantImage(variant) {
    if (!variant) return product?.image || "";
    const variantIndex = variants.findIndex(
      (item) => String(item._id) === String(variant._id),
    );
    const uniqueColors = [...new Set(variants.map((item) => String(item.color || "").toLowerCase()))];
    const colorIndex = uniqueColors.indexOf(String(variant.color || "").toLowerCase());
    return variant.image || galleryImages[colorIndex] || galleryImages[variantIndex] || product?.image || "";
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
        selectedImage: getVariantImage(selectedVariant),
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
          selectedImage: getVariantImage(matchingVariant),
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
          <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-gray-50 p-3 sm:p-6">
            <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-lg bg-white md:min-h-[300px] lg:min-h-[450px]">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="h-[260px] w-full max-w-lg cursor-zoom-in rounded-lg object-contain transition duration-300 hover:scale-110 md:h-[300px] lg:h-[450px]"
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {galleryImages.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(imageUrl);
                      // Selecting a variant image also selects its matching variant.
                      const matchingVariant = variants.find(
                        (variant) => getVariantImage(variant) === imageUrl,
                      );
                      if (matchingVariant) {
                        setSelectedVariant(matchingVariant);
                        setSelectedColor(matchingVariant.color || "");
                        setSelectedSize(matchingVariant.size || "");
                      }
                    }}
                    aria-label={`Show product image ${index + 1}`}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 bg-white p-1 transition sm:h-20 sm:w-20 ${activeImage === imageUrl ? "border-blue-600" : "border-gray-200 hover:border-blue-400"}`}
                  >
                    <img src={imageUrl} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
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
              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 text-sm font-medium text-gray-600">
                    Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {colorOptions.map((colorVariant) => {
                      const color = colorVariant.color;
                      const isSelected = String(selectedColor).toLowerCase() === String(color).toLowerCase();
                      const matchingSize = findVariant(color, selectedSize);
                      const availableColorVariants = variants.filter(
                        (item) => String(item.color).toLowerCase() === String(color).toLowerCase()
                      );
                      const displayVariant = matchingSize || availableColorVariants.reduce(
                        (lowest, item) => !lowest || Number(item.price) < Number(lowest.price) ? item : lowest,
                        null,
                      );
                      const colorImage = getVariantImage(colorVariant);

                      return (
                        <button
                          key={`${color}-${colorVariant._id || "color"}`}
                          type="button"
                          onClick={() => selectColor(color)}
                          className={`overflow-hidden rounded-xl border text-left transition ${isSelected ? "border-blue-600 ring-2 ring-blue-600" : "border-gray-300 hover:border-blue-400"}`}
                        >
                          <div className="flex h-20 items-center justify-center bg-gray-50 p-2 sm:h-24">
                            <img src={colorImage} alt={color} className="h-full w-full object-contain" />
                          </div>
                          <div className="border-t px-2 py-2">
                            <p className="truncate text-sm font-semibold text-gray-900">{color}</p>
                            <p className="text-sm font-medium">₹{displayVariant?.price ?? product.price}</p>
                            <p className="text-xs text-gray-500">
                              {matchingSize
                                ? `Stock: ${matchingSize.stock}`
                                : `Total stock: ${availableColorVariants.reduce((sum, item) => sum + Number(item.stock || 0), 0)}`}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-sm font-medium text-gray-600">
                    Size: <span className="font-semibold text-gray-900">{selectedSize || "Select size"}</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => {
                      const sizeVariant = findVariant(selectedColor, size);
                      const unavailable = !sizeVariant || Number(sizeVariant.stock) < 1;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={unavailable}
                          onClick={() => selectSize(size)}
                          className={`min-w-12 rounded-lg border px-3 py-2 text-sm transition ${isSelected ? "border-blue-600 bg-blue-50 font-semibold text-blue-700 ring-1 ring-blue-600" : "border-gray-300 hover:border-blue-400"} ${unavailable ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through opacity-60" : ""}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {selectedVariant && (
                    <p className="mt-2 text-sm text-gray-500">
                      Price: <span className="font-semibold text-gray-900">₹{selectedVariant.price}</span>
                      <span className="mx-2">·</span>
                      Stock: <span className="font-semibold text-gray-900">{selectedVariant.stock}</span>
                    </p>
                  )}
                  {!selectedVariant && (
                    <p className="mt-2 text-sm text-red-600">This color and size combination is unavailable.</p>
                  )}
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
                disabled={variants.length > 0 && (!selectedVariant || Number(selectedVariant.stock) < quantity)}
                onClick={buyNow}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaBolt />
                Buy Now
              </button>

              <button
                disabled={variants.length > 0 && (!selectedVariant || Number(selectedVariant.stock) < quantity)}
                onClick={addToCart}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="h-[100px] w-full rounded object-contain sm:h-[130px] md:h-[150px] 2xl:h-[210px]"
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
