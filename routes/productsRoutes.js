import express from "express";
import isAuthenticated from "../utils/isAuthenticated.js";
import { isAdmin } from "../utils/isAdmin.js";
import {
  createProductController,
  deleteProductController,
  getAdminAllProductsController,
  getCategoriesController,
  getSingleProductController,
  latestProductController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";

const router = express.Router();

// definig the routes for products

// new product / create product product
router.post(
  // http://localhost:8000/api/product/create-product
  "/create-product",
  isAuthenticated,
  isAdmin,
  createProductController
);

// getting all products for admin
router.get(
  // http://localhost:8000/api/product/admin-product
  "/admin-products",
  isAuthenticated,
  isAdmin,
  getAdminAllProductsController
);

// search produts -http://localhost:8000/api/product/search
router.get("/search", searchProductController);

// getting latest product
// http://localhost:8000/api/product/latest-product
router.get("/latest-product", latestProductController);

// getting all categories
// http://localhost:8000/api/product/categories
router.get("/categories", getCategoriesController);

// get single product - http://localhost:8000/api/product/:id
router.get("/:id", getSingleProductController);

// update product - http://localhost:8000/api/product/:id
router.put("/:id", isAuthenticated, isAdmin, updateProductController);

// deleting the product - http://localhost:8000/api/product/:id
router.delete("/:id", isAuthenticated, isAdmin, deleteProductController);

export default router;
