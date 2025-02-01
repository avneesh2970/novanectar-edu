import express from "express";
import { contacts, getAllContacts } from "./contacts.controller.js";

const contactRouter = express.Router();

contactRouter.post("/contacts", contacts);
// contactRouter.get("/all-contacts", protectRoute, getAllContacts)
contactRouter.get("/all-contacts", getAllContacts)

export default contactRouter;
