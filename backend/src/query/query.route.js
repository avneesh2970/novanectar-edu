import express from "express";
import { getAllQueries, healthCheck, queryForm } from "./query.controller.js";
const router = express.Router();

router.route("/query-form").post(queryForm);
router.route("/health-check").get(healthCheck);
// router.route("/all-queries").get(protectRoute, getAllQueries)
router.route("/all-queries").get(getAllQueries)

export default router;
