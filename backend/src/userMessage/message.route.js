import express from "express";
import { getAllUserMessages, userMessage } from "./message.controller.js";

const userMessageRouter = express.Router();

userMessageRouter.post("/user-message", userMessage);
userMessageRouter.get("/all-user-messages", getAllUserMessages);

export default userMessageRouter;
