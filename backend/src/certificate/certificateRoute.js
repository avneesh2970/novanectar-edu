import express from "express"
const certificateRouter = express.Router()
import { getCertificateById } from "./certificate.controller.js";

// Verify certificate by certificateId
// Example: GET /api/admin/certificates/NN%2FIN%2F01%2F1000
certificateRouter.get("/certificates/:id", getCertificateById)

export default certificateRouter;
