import mongoose from "mongoose"

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    expiry: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  },
)

export default mongoose.model("Coupon", couponSchema)
