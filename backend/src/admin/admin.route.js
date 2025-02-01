import express from "express";
import {
  getEnrollmentStats,
  getFilteredEnrollments,
} from "./admin.controller.js";
// import { protectRoute, adminOnly } from "../middlewares/auth.middleware.js";
// import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.get("/enrollment-stats", protectRoute, adminOnly, getEnrollmentStats)
// router.get("/filtered-enrollments", protectRoute, adminOnly, getFilteredEnrollments)
router.get("/enrollment-stats", getEnrollmentStats);
router.get("/filtered-enrollments", getFilteredEnrollments);

export default router;
