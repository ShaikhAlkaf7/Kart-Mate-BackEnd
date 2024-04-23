import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
} from "../../controller/adminController/adminUserController.js";
import isAuthenticated from "../../utils/isAuthenticated.js";
import { isAdmin } from "../../utils/isAdmin.js";
const router = express.Router();

// definig the routes for admin routes

// get all users - /api/admin/users
router.get("/users", isAuthenticated, isAdmin, getAllUser);

// getting the single user
router.get("/user/:id", isAuthenticated, isAdmin, getUser);

// deleting the user
router.delete("/user/:id", isAuthenticated, isAdmin, deleteUser);

export default router;
