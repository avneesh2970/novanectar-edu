import { Order } from "./order.model.js";
import { razorpay } from "./razorpay.config.js";
import crypto from "crypto";
import User from "../user/user.model.js";

import mongoose from "mongoose";
// const { ObjectId } = mongoose.Types;

// Create order endpoint
const createOrder = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      amount,
      name,
      email,
      phone,
      orderType,
    } = req.body;
    const userId = req.user._id;

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        courseId: courseId,
        userId: userId,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    // Create order in database
    const order = new Order({
      courseId,
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      userId,
      orderType,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
      name,
      email,
      phone,
    });

    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      orderType,
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      amount: amount * 100,
      currency: "INR",
      notes: options.notes,
      name,
      email,
      phone,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify payment endpoint
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update order status in database
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          status: "paid",
        },
        { new: true }
      );

      if (updatedOrder) {
        // Add the enrollment to the user's schema
        // const itemId = updatedOrder.courseId;

        await User.findByIdAndUpdate(
          updatedOrder.userId,
          {
            $push: {
              enrollments: {
                type: updatedOrder.orderType,
                item: updatedOrder._id,
              },
            },
          },
          { new: true }
        );
      }

      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export { createOrder, verifyPayment };
