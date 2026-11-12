import productModel from "../model/product.js";
import mongoose from "mongoose";

export async function createProduct(req, res) {
  try {
    const {
      name,
      price,
      description,
      category = "Product",
      image,
      images = [],
      ratings,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Enter the product name",
      });
    }

    if (/^\d+$/.test(name)) {
      return res.status(400).json({
        message: "Name cannot contain only numbers",
      });
    }

    if (!price || Number(price) <= 50) {
      return res.status(400).json({
        message: "Enter valid price",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Enter the product description",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Select category",
      });
    }

    if (!image || !image.trim()) {
      return res.status(400).json({
        message: "Enter product imageURL",
      });
    }

    const parsedImages = Array.isArray(images) ? images : [];
    const galleryImages = [...new Set([image.trim(), ...parsedImages.map((url) => String(url).trim()).filter(Boolean)])];

    const variants = req.body.variants || "[]";

    const product = await productModel.create({
      name,
      price,
      description,
      category,
      image: image.trim(),
      images: galleryImages,
      variants,
      ratings,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function getProducts(req, res) {
  try {
    const { search, minPrice, maxPrice, page = 1, limit = 15 } = req.query;

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) {
        query.price = {
          ...query.price,
          $gte: min,
        };
      }
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        query.price = {
          ...query.price,
          $lte: max,
        };
      }
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const products = await productModel
      .find(query)
      .populate("category")
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await productModel.countDocuments(query);

    const hasMore = skip + products.length < totalProducts;

    return res.status(200).json({
      message: "Products Fetched Successfully",
      products,
      hasMore,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function allProducts(req, res) {
  try {
    const products = await productModel.find();

    return res.status(200).json({
      message: "Products fetched",
      products,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 15,
    } = req.query;

    if (!category) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    const query = { category };

    if (search?.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (minPrice !== undefined && minPrice !== "") {
      const min = Number(minPrice);

      if (!Number.isFinite(min)) {
        return res.status(400).json({
          message: "Invalid minimum price",
        });
      }

      query.price = {
        ...query.price,
        $gte: min,
      };
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = Number(maxPrice);

      if (!Number.isFinite(max)) {
        return res.status(400).json({
          message: "Invalid maximum price",
        });
      }

      query.price = {
        ...query.price,
        $lte: max,
      };
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 15);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await productModel
      .find(query)
      .populate("category")
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await productModel.countDocuments(query);

    const hasMore = skip + products.length < totalProducts;

    return res.status(200).json({
      message: "Category products fetched successfully",
      products,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const { name, price, description, category, image, images = [], ratings, variants } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Enter the product name" });
    }

    if (/^\d+$/.test(name.trim())) {
      return res.status(400).json({
        message: "Name cannot contain only numbers",
      });
    }

    if (price === undefined || price === null || Number(price) <= 50) {
      return res.status(400).json({ message: "Enter valid price" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Enter the product description",
      });
    }

    if (!category) {
      return res.status(400).json({ message: "Select category" });
    }

    if (!image || !image.trim()) {
      return res.status(400).json({
        message: "Enter product imageURL",
      });
    }

    if (ratings !== undefined && (Number(ratings) < 0 || Number(ratings) > 5)) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5",
      });
    }

    const updateData = {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      image: image.trim(),
      images: [...new Set([image.trim(), ...(Array.isArray(images) ? images : []).map((url) => String(url).trim()).filter(Boolean)])],
    };

    if (ratings !== undefined) {
      updateData.ratings = Number(ratings);
    }

    if (variants !== undefined) {
      const parsedVariants =
        typeof variants === "string" ? JSON.parse(variants) : variants;

      if (!Array.isArray(parsedVariants)) {
        return res.status(400).json({
          message: "Variants must be an array",
        });
      }

      updateData.variants = parsedVariants.map((variant) => {
        if (variant._id) {
          return variant;
        }

        const existingVariant = product.variants.find(
          (item) => item.size === variant.size && item.color === variant.color,
        );

        return existingVariant
          ? {
            ...variant,
            _id: existingVariant._id,
          }
          : variant;
      });
    }

    const updatedProduct = await productModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("category");

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: " Product Deleted Sucessfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
