import express from "express";
import Coupon from "./CouponModel.js";

const router = express.Router();

// Get all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create new coupon
router.post("/", async (req, res) => {
  try {
    const { code, discountPercent, expiry, maxClaims } = req.body;
console.log("....", code, discountPercent, expiry, maxClaims)
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercent,
      expiry: new Date(expiry),
      maxClaims: maxClaims || 50,
      claimedCount: 0,
      active: true,
    });
    await coupon.save();

    res.json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update coupon (toggle active status)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete coupon
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Validate coupon (for frontend use)
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid coupon code" });
    }

    if (coupon.expiry < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }

    if (coupon.claimedCount >= coupon.maxClaims) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon usage limit reached" });
    }

    coupon.claimedCount += 1;
    if (coupon.claimedCount >= coupon.maxClaims) {
      coupon.active = false;
    }

    await coupon.save();

    res.json({ success: true, discountPercent: coupon.discountPercent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
