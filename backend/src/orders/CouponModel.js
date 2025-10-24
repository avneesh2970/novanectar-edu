import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    expiry: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// 🔁 Middleware to auto-deactivate expired coupons
couponSchema.pre(/^find/, async function (next) {
  await this.model.updateMany(
    { expiry: { $lt: new Date() }, active: true },
    { $set: { active: false } }
  );
  next();
});

export default mongoose.model("Coupon", couponSchema);
