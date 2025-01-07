import express from "express";
import { contacts } from "./contacts.controller.js";

const contactRouter = express.Router();

contactRouter.post("/contacts", contacts);

export default contactRouter;
