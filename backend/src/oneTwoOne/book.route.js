import express from "express";
import { bookSession, getBookedSessions } from "./book.controller.js";
const bookRouter = express.Router();

bookRouter.route("/book-session").post(bookSession);
bookRouter.route("/get-bookings").get(getBookedSessions);


export default bookRouter;
