import express from "express";
import isAuthenticated from "../../utils/isAuthenticated.js";
import { isAdmin } from "../../utils/isAdmin.js";
import {
  barController,
  lineController,
  pieController,
  statsController,
} from "../../controller/adminController/stats.js";

const router = express.Router();

// getting the stats for dashboard - /api/dashboard/stats
router.get("/stats", isAuthenticated, isAdmin, statsController);

// getting data fro pie chart - /api/dashboard/pie
router.get("/pie", isAuthenticated, isAdmin, pieController);

// getting data for bar charts - /api/dashboard/bar
router.get("/bar", isAuthenticated, isAdmin, barController);

// getting data for line charts - /api/dashboard/line
router.get("/line", isAuthenticated, isAdmin, lineController);

export default router;
