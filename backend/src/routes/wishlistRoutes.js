import express from "express";
import Authmiddleware from "../middlewares/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controller/wishlistController.js";

const router = express.Router();

router.get("/", Authmiddleware, getWishlist);
router.post("/add", Authmiddleware, addToWishlist);
router.delete("/:productId", Authmiddleware, removeFromWishlist);

export default router;
