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
  //   type: mongoose.Schema.Types.Mixed,
  //   ref: "User",
  //   default: "",
  //   set: (v) => (v === "" ? v : mongoose.Types.ObjectId(v)),
  // },
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: "User",
    set: function (v) {
      if (v === null || v === "") return null;
      if (typeof v === "object" && v._id) return v._id;
      if (mongoose.Types.ObjectId.isValid(v)) return mongoose.Types.ObjectId(v);
      return v;
    },
    get: function (v) {
      if (v === null || v === "") return null;
      if (mongoose.Types.ObjectId.isValid(v)) return v.toString();
      return v;
    },
  },
  orderType: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
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
