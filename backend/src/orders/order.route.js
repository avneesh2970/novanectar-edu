import { protectRouteForPayment } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "./payments.controller.js";
import express from "express";
const paymentRouter = express.Router();

paymentRouter.post("/create-order",protectRouteForPayment, createOrder);

paymentRouter.post("/verify-payment", verifyPayment);

export default paymentRouter;
