import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  allProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

router.get("/allproducts", allProducts);
router.get("/getproducts", getProducts);
router.get("/category", getProductsByCategory);
router.get("/:id", getProduct);
router.post("/createproduct", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
