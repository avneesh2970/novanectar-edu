import express from "express";
import { healthCheck, queryForm } from "./query.controller.js";
const router = express.Router();

router.route("/query-form").post(queryForm);
router.route("/health-check").get(healthCheck);

export default router;
