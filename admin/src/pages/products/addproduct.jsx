import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Addproducts() {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    images: [""],
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
      const res = await fetch("http://localhost:3000/api/category/allcategory");
      const data = await res.json();
      setCategory(data.categorys);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategory();
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3000/api/products/createproduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formdata, images: formdata.images.filter((url) => url.trim()) }),
        },
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

  function addVariant() {
    setFormdata((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));

    setVariant({
      size: "",
      price: "",
      color: "",
      stock: "",
      image: "",
    });
  }

  function handleVariantChange(e) {
    const { name, value } = e.target;

    setVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-[400px] flex flex-col gap-[20px] p-5">
        <form
          className="border border-blue-200 rounded-lg flex flex-col justify-center items-center gap-5 px-4 py-8 bg-gray-50 hover:shadow-xl"
          onSubmit={handleSubmit}
        >
          <h1 className="text-xl font-semibold pb-3">Add Products</h1>
          <input
            type="text"
            name="name"
            required
            value={formdata.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full bg-white border border-gray-400 rounded-lg p-2 "
          />
          <input
            type="number"
            name="price"
            required
            value={formdata.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full  bg-white border border-gray-400  rounded-lg p-2 "
          />
          <input
            type="text"
            name="description"
            value={formdata.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full  bg-white border border-gray-400  rounded-lg p-2 "
          />
          <select
            name="category"
            required
            value={formdata.category}
            onChange={handleChange}
            className="w-full bg-white border border-gray-400 rounded-lg p-2 "
          >
            <option value="">Select Category</option>

            {category.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="ratings"
            required
            value={formdata.ratings}
            onChange={handleChange}
            placeholder="Enter ratings"
            className="w-full  bg-white border border-gray-400  rounded-lg p-2 "
          />
          <input
            type="text"
            name="image"
            required
            value={formdata.image}
            onChange={handleChange}
            placeholder="Enter imageURL"
            className="w-full  bg-white border border-gray-400  rounded-lg p-2 "
          />
          <div className="w-full rounded-lg border border-gray-300 p-3">
            <h2 className="mb-2 font-semibold">Additional Product Images</h2>
            <p className="mb-3 text-xs text-gray-500">Add different image URLs for other product angles.</p>
            {formdata.images.map((url, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input type="url" value={url} onChange={(e) => handleGalleryImageChange(index, e.target.value)} placeholder={`Additional image URL ${index + 1}`} className="min-w-0 flex-1 rounded-lg border border-gray-400 bg-white p-2" />
                <button type="button" onClick={() => removeGalleryImage(index)} className="rounded border px-3 text-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addGalleryImage} className="rounded border border-blue-500 bg-blue-50 px-3 py-2 text-sm">+ Add image</button>
          </div>
          <div className="w-full border border-gray-300 rounded-lg p-3">
            <h1 className="font-semibold mb-3">Variants</h1>
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
                className="border border-blue-500 rounded-md p-2 bg-blue-100"
              >
                Add Variant
              </button>
            </div>

            {formdata.variants.map((item, index) => (
              <div key={index} className="mt-3 p-2 bg-gray-100 rounded">
                <p>
                  {item.size} - {item.color} - ₹{item.price} - Stock:{" "}
                  {item.stock}
                </p>
              </div>
            ))}
          </div>

          <button
            className="border border-gray-500  rounded-md bg-white p-2 cursor-pointer hover:bg-blue-100 w-[200px] "
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Addproducts;
