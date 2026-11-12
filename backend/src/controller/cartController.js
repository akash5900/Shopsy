import cartModel from "../model/cartModel.js";
import productModel from "../model/product.js";

export async function addToCart(req, res) {
  try {
    const { product: productId, quantity = 1, variant = null } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const selectedVariantId = variant?._id ?? variant;

    const selectedVariant = product.variants.find(
      (item) => String(item._id) === String(selectedVariantId),
    );

    if (!selectedVariant) {
      return res.status(400).json({
        message: "Selected variant not found. Please refresh the product page.",
      });
    }

    const existing = await cartModel.findOne({
      product: productId,
      user: req.user.id,
      variant: selectedVariant._id,
    });

    if (existing) {
      existing.quantity += Number(quantity);
      await existing.save();

      return res.status(200).json({
        message: "Product quantity updated in cart",
        cart: existing,
      });
    }

    const cart = await cartModel.create({
      user: req.user.id,
      product: productId,
      variant: selectedVariant._id,
      quantity: Number(quantity),
    });

    return res.status(201).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("addToCart error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
}

export async function getCart(req, res) {
  try {
    const cartItems = await cartModel
      .find({ user: req.user.id })
      .populate("user", "email")
      .populate("product");

    const cart = cartItems.map((item) => {
      const cartItem = item.toObject();

      let variants = cartItem.product?.variants || [];

      if (typeof variants === "string") {
        try {
          variants = JSON.parse(variants);
        } catch {
          variants = [];
        }
      }

      const selectedVariant = variants.find(
        (v) => String(v._id) === String(cartItem.variant),
      );

      if (selectedVariant) {
        const variantIndex = variants.findIndex(
          (v) => String(v._id) === String(selectedVariant._id),
        );
        selectedVariant.image =
          selectedVariant.image ||
          cartItem.product?.images?.[variantIndex] ||
          cartItem.product?.image ||
          "";
      }

      cartItem.variant = selectedVariant || null;

      return cartItem;
    });

    return res.status(200).json({
      message: cart.length ? "Cart Products" : "Cart is empty",
      cart,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
}

export async function removeFromCart(req, res) {
  try {
    const cart = await cartModel.findOneAndDelete(req.params.id);

    if (!cart) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
}
