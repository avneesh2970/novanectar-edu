import { protectRouteForPayment } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  // handleWebhook,
  verifyPayment,
  findOrders,
  sendOfferLetter,
  successfulPayments,
} from "./payments.controller.js";
import express from "express";
const paymentRouter = express.Router();

paymentRouter.post("/create-order", protectRouteForPayment, createOrder);

paymentRouter.post("/verify-payment", verifyPayment);

// paymentRouter.post("/razorpay-webhook", handleWebhook);

paymentRouter.post("/find-orders", findOrders);

paymentRouter.post("/send-offer-letter", sendOfferLetter);

paymentRouter.get("/successful-payments", successfulPayments);

export default paymentRouter;
