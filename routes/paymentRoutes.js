import express from "express";
import {
  applyDiscountController,
  createPayment,
  cuponDeleteController,
  getAllCuponsController,
  newCuponController,
} from "../controller/paymentController.js";
import isAuthenticated from "../utils/isAuthenticated.js";
import { isAdmin } from "../utils/isAdmin.js";

const router = express.Router();

// paymet gateway - /api/payment/create
router.post("/create", createPayment);

// genreting the cupon - /api/payment/cupon/new
router.post("/cupon/new", isAuthenticated, isAdmin, newCuponController);

// give the discount and validating the cupnon code - /api/payment/discount
router.get("/discount", isAuthenticated, applyDiscountController);

// get all cupon for admi - /api/payment/cupon/all
router.get("/cupon/all", isAuthenticated, isAdmin, getAllCuponsController);

// deleting the cupon - /api/payment/cupon/:id
router.delete("/cupon/:id", isAuthenticated, isAdmin, cuponDeleteController);

export default router;
