import express from "express";
import {
  allOrdersController,
  deleteOrderController,
  getSingleOrderController,
  myOrderController,
  newOrderController,
  processOrderController,
} from "../controller/orderController.js";
import isAuthenticated from "../utils/isAuthenticated.js";
import { isAdmin } from "../utils/isAdmin.js";

const router = express.Router();

// new order route - /api/order/new
router.post("/new", isAuthenticated, newOrderController);

// my orders route - /api/order/my-orders
router.get("/my-orders", isAuthenticated, myOrderController);

// get all orders for admin - /api/order/all-orders
router.get("/all-orders", isAuthenticated, isAdmin, allOrdersController);

// getting single order - /api/order/:id
router.get("/:id", isAuthenticated, getSingleOrderController);

// updating ther order
router.put("/:id", isAuthenticated, isAdmin, processOrderController);

// delteting the order by id
router.delete("/:id", isAuthenticated, isAdmin, deleteOrderController);
export default router;
