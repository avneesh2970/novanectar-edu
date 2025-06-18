import mongoose from "mongoose";

const paymentAttemptSchema = new mongoose.Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  email: String,
  status: { type: String, default: "pending" },  // pending | success | failed
  error: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PaymentAttempt", paymentAttemptSchema);
