import express from "express";
import {
  getUser,
  loginController,
  signupConroller,
} from "../controller/userController.js";
import isAuthenticated from "../utils/isAuthenticated.js";
const router = express.Router();

// definig the routes for signup

// signup
router.post("/signup", signupConroller);

// login
router.post("/login", loginController);

// getting usere  info
router.get("/get-user", isAuthenticated, getUser);

export default router;
