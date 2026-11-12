import wishlistModel from "../model/wishlistModel.js";
import productModel from "../model/product.js";

export async function getWishlist(req, res) {
    try {
        const wishlist = await wishlistModel
            .findOne({ user: req.user.id })
            .populate("products");

        return res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist: wishlist?.products || [],
        });
    } catch (error) {
        console.error("getWishlist error:", error);
        return res.status(500).json({
            message: "Failed to fetch wishlist",
            error: error.message,
        });
    }
}

export async function addToWishlist(req, res) {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await wishlistModel.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await wishlistModel.create({
                user: req.user.id,
                products: [productId],
            });
        } else if (!wishlist.products.some((id) => String(id) === String(productId))) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        await wishlist.populate("products");

        return res.status(200).json({
            message: "Product added to wishlist",
            wishlist: wishlist.products,
        });
    } catch (error) {
        console.error("addToWishlist error:", error);
        return res.status(500).json({
            message: "Failed to add product to wishlist",
            error: error.message,
        });
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const { productId } = req.params;

        const wishlist = await wishlistModel.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { products: productId } },
            { new: true },
        ).populate("products");

        return res.status(200).json({
            message: "Product removed from wishlist",
            wishlist: wishlist?.products || [],
        });
    } catch (error) {
        console.error("removeFromWishlist error:", error);
        return res.status(500).json({
            message: "Failed to remove product from wishlist",
            error: error.message,
        });
    }
}
