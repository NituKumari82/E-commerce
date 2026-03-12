import express from "express";
import { 
  getAllProducts, 
  getFeaturedProducts, 
  createProduct, 
  deleteProduct, 
  getRecommendedProducts, 
  getProductByCategory, 
  toggleFeatureProduct // Matches controller export
} from "../controllers/product.controller.js";

import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendedProducts);

router.post("/", protectRoute, adminRoute, createProduct);

// FIX: Changed toggleFeaturedProduct to toggleFeatureProduct to match the import above
router.patch("/:id", protectRoute, adminRoute, toggleFeatureProduct);

router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
