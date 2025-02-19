import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { dbConnect } from "./src/lib/dbConnect.js";
import router from "./src/query/query.route.js";
import paymentRouter from "./src/orders/order.route.js";
import contactRouter from "./src/contacts/contacts.route.js";
import authRoutes from "./src/user/user.route.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./src/admin/admin.route.js";
import bookRouter from "./src/oneTwoOne/book.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api", router);
app.use("/api", paymentRouter);
app.use("/api", contactRouter);
app.use("/api", bookRouter);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 5000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
