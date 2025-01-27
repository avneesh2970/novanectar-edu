import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
//   updateProfile,
} from "./user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({ home: "ok", message: "this is home route" });
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
