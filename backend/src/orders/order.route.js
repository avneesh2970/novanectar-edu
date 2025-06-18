import { protectRouteForPayment } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  handleWebhook,
  verifyPayment,
} from "./payments.controller.js";
import express from "express";
const paymentRouter = express.Router();

paymentRouter.post("/create-order", protectRouteForPayment, createOrder);

paymentRouter.post("/verify-payment", verifyPayment);

paymentRouter.post("/razorpay-webhook", handleWebhook);

export default paymentRouter;
