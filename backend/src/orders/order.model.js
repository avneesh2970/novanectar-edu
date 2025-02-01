import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
  },
  courseTitle: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  courseImg: {
    type: String,
  },
  // userId: {
  //   type: String,
  //   required: true,
  // },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);
