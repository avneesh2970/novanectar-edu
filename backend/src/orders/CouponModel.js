import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    expiry: { type: Date, required: true },
    active: { type: Boolean, default: true },
    maxClaims: { type: Number, required: true, default: 50 },
    claimedCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// 🔁 Middleware to auto-deactivate expired coupons
couponSchema.pre(/^find/, async function (next) {
  await this.model.updateMany(
    {
      $or: [
        { expiry: { $lt: new Date() } },
        { $expr: { $gte: ["$claimedCount", "$maxClaims"] } },
      ],
      active: true,
    },
    { $set: { active: false } }
  );
  next();
});

export default mongoose.model("Coupon", couponSchema);
