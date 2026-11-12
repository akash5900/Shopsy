import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Updateproduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    images: [],
    ratings: "",
    variants: [],
  });

  const [variant, setVariant] = useState({
    size: "",
    price: "",
    color: "",
    stock: "",
    image: "",
  });

  const [category, setCategory] = useState([]);

  async function getCategory() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/category/allcategory"
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setCategory(data.categorys || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function getProduct() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products/${id}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      const product = data.product;

      setFormdata({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",

        category:
          typeof product.category === "object"
            ? product.category?._id
            : product.category || "",

        image: product.image || "",
        images: Array.isArray(product.images) ? product.images : [],
        ratings: product.ratings ?? "",

        variants: Array.isArray(product.variants)
          ? product.variants.map((item, index) => ({
            ...item,
            image: item.image || [product.image, ...(product.images || [])][index] || "",
          }))
          : [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleGalleryImageChange(index, value) {
    setFormdata((prev) => ({
      ...prev,
      images: prev.images.map((url, i) => (i === index ? value : url)),
    }));
  }

  function addGalleryImage() {
    setFormdata((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function removeGalleryImage(index) {
    setFormdata((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  useEffect(() => {
    getProduct();
    getCategory();
  }, [id]);

  async function handlesubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formdata,
            images: formdata.images.filter((url) => url.trim()),
            price: Number(formdata.price),
            ratings: Number(formdata.ratings),

            variants: formdata.variants.map((item) => ({
              ...(item._id ? { _id: item._id } : {}),
              size: item.size,
              price: Number(item.price),
              color: item.color,
              stock: Number(item.stock),
              image: item.image || "",
            })),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      navigate("/admin/allproducts");
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleVariantChange(e) {
    const { name, value } = e.target;

    setVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function addVariant() {
    if (
      !variant.size.trim() ||
      !variant.price ||
      !variant.color.trim() ||
      variant.stock === ""
    ) {
      alert("Please fill all variant fields");
      return;
    }

    const newVariant = {
      size: variant.size.trim(),
      price: Number(variant.price),
      color: variant.color.trim(),
      stock: Number(variant.stock),
      image: variant.image || "",
    };

    setFormdata((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));

    setVariant({
      size: "",
      price: "",
      color: "",
      stock: "",
      image: "",
    });
  }

  function removeVariant(index) {
    setFormdata((prev) => ({
      ...prev,
      variants: prev.variants.filter(
        (_, i) => i !== index
      ),
    }));
  }

  return (
    <div className="flex items-center justify-center mt-[100px]">
      <div className="w-[400px] flex flex-col gap-[20px] p-5">
        <form
          className="border border-blue-200 rounded-lg flex flex-col justify-center items-center gap-5 px-4 py-10 bg-gray-50 hover:shadow-xl"
          onSubmit={handlesubmit}
        >
          <h1 className="text-xl font-semibold pb-3">
            Update Product
          </h1>

          <input
            type="text"
            required
            name="name"
            value={formdata.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <input
            type="number"
            required
            name="price"
            value={formdata.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <input
            type="text"
            required
            name="description"
            value={formdata.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <select
            name="category"
            required
            value={formdata.category}
            onChange={handleChange}
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          >
            <option value="">Select Category</option>

            {category.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="image"
            required
            value={formdata.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <div className="w-full rounded-lg border border-gray-300 p-3">
            <h2 className="mb-2 font-semibold">Additional Product Images</h2>
            <p className="mb-3 text-xs text-gray-500">Add or remove product gallery image URLs.</p>
            {formdata.images.map((url, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                  placeholder={`Additional image URL ${index + 1}`}
                  className="min-w-0 flex-1 rounded-lg border border-gray-400 bg-white p-2"
                />
                <button type="button" onClick={() => removeGalleryImage(index)} className="rounded border px-3 text-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addGalleryImage} className="rounded border border-blue-500 bg-blue-50 px-3 py-2 text-sm">+ Add image</button>
          </div>

          <input
            type="number"
            name="ratings"
            min="0"
            max="5"
            step="0.1"
            required
            value={formdata.ratings}
            onChange={handleChange}
            placeholder="Enter rating"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <div className="w-full border border-gray-300 rounded-lg p-3">
            <h1 className="font-semibold mb-3">
              Variants
            </h1>
            <p className="mb-3 text-xs text-gray-500">Add one entry for every color and size combination, for example Black / S, Black / M, Blue / S.</p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="size"
                value={variant.size}
                onChange={handleVariantChange}
                placeholder="Size (S, M, L)"
                className="w-full bg-white border border-gray-400 rounded-lg p-2"
              />

              <input
                type="number"
                name="price"
                value={variant.price}
                onChange={handleVariantChange}
                placeholder="Variant price"
                className="w-full bg-white border border-gray-400 rounded-lg p-2"
              />

              <input
                type="text"
                name="color"
                value={variant.color}
                onChange={handleVariantChange}
                placeholder="Color"
                className="w-full bg-white border border-gray-400 rounded-lg p-2"
              />

              <input
                type="number"
                name="stock"
                value={variant.stock}
                onChange={handleVariantChange}
                placeholder="Stock"
                min="0"
                className="w-full bg-white border border-gray-400 rounded-lg p-2"
              />

              <select
                name="image"
                value={variant.image}
                onChange={handleVariantChange}
                className="w-full bg-white border border-gray-400 rounded-lg p-2"
              >
                <option value="">Use matching gallery image by order</option>
                {[...new Set([formdata.image, ...formdata.images].filter(Boolean))].map((url, index) => (
                  <option key={`${url}-${index}`} value={url}>Product image {index + 1}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={addVariant}
                className="border border-blue-500 rounded-md p-2 bg-blue-100 hover:bg-blue-200"
              >
                Add Variant
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {formdata.variants.map((item, index) => (
                <div
                  key={item._id || index}
                  className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {item.size} - {item.color}
                    </p>

                    <p className="text-sm text-gray-600">
                      ₹{item.price} | Stock: {item.stock}
                    </p>
                    <select
                      value={item.image || ""}
                      onChange={(e) =>
                        setFormdata((prev) => ({
                          ...prev,
                          variants: prev.variants.map((variant, i) =>
                            i === index ? { ...variant, image: e.target.value } : variant,
                          ),
                        }))
                      }
                      className="mt-2 w-full rounded border border-gray-300 bg-white p-2 text-sm"
                    >
                      <option value="">Use gallery image by variant order</option>
                      {[...new Set([formdata.image, ...formdata.images].filter(Boolean))].map((url, imageIndex) => (
                        <option key={`${url}-${imageIndex}`} value={url}>Product image {imageIndex + 1}</option>
                      ))}
                    </select>
                    {item.image && <img src={item.image} alt={`${item.color} variant`} className="mt-2 h-12 w-12 rounded object-contain bg-white" />}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="border border-gray-500 rounded-md bg-white p-2 cursor-pointer hover:bg-blue-100 w-[200px]"
            type="submit"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default Updateproduct;

