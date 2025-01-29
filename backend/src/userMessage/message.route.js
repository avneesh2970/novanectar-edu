import express from "express";
import { userMessage } from "./message.controller.js";

const userMessageRouter = express.Router();

userMessageRouter.post("/user-message", userMessage);

export default userMessageRouter;
