import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { dbConnect } from "./src/lib/dbConnect.js";
import router from "./src/query/query.route.js";
import paymentRouter from "./src/orders/order.route.js";
import contactRouter from "./src/contacts/contacts.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api", router);
app.use("/api", paymentRouter);
app.use("/api", contactRouter);
const PORT = process.env.PORT || 5000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
