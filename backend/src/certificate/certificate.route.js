import express from "express";
import { getCertificate } from "./certificate.controller.js";

const certificateRouter = express();

certificateRouter.post("/get-certificate", getCertificate );

export default certificateRouter;