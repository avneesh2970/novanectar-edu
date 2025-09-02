import { isValid } from "date-fns";
import validator from "validator";
import Certificate from "./certificate.model.js";

export const certificateUpload = async (req, res) => {
  try {
    // Extract form data
    const {
      certificateId,
      type,
      name,
      programTitle,
      mode,
      company,
      durationMonths,
      durationDays,
      startDate,
      endDate,
      status,
      certificateImageUrl,
    } = req.body;

    // Validation for required fields
    if (!certificateId || !name || !programTitle || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Certificate ID, Student Name, Program Title, Start Date, and End Date are required",
      });
    }

    // Validate certificate type
    if (!["Internship", "Training"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate type. Must be Internship or Training",
      });
    }

    // Validate mode
    if (!["Offline", "Online", "Hybrid"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mode. Must be Offline, Online, or Hybrid",
      });
    }

    // Validate status
    if (!["Active", "Revoked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be Active or Revoked",
      });
    }

    // Validate dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for startDate or endDate",
      });
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Validate duration
    const months = parseInt(durationMonths, 10);
    const days = parseInt(durationDays, 10);
    if (isNaN(months) || isNaN(days) || months < 0 || days < 0) {
      return res.status(400).json({
        success: false,
        message: "Duration months and days must be valid non-negative numbers",
      });
    }

    // Validate image: either file or URL can be provided (optional as per model)
    if (req.file && certificateImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Provide either an image file or an image URL, not both",
      });
    }

    // Validate URL if provided
    let certificateImage = null;
    if (certificateImageUrl) {
      if (!validator.isURL(certificateImageUrl)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image URL",
        });
      }
      certificateImage = certificateImageUrl;
    } else if (req.file) {
      certificateImage = req.file.path; // Cloudinary secure URL
    }

    // Check for duplicate certificateId
    const existingCertificate = await Certificate.findOne({ certificateId });
    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID already exists",
      });
    }

    // Create new certificate
    const newCertificate = new Certificate({
      certificateId,
      type,
      name,
      programTitle,
      mode,
      company,
      duration: { months, days },
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      status,
      certificateImage, // Store either Cloudinary URL, provided URL, or null
    });

    // Save to database
    await newCertificate.save();

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      data: newCertificate,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCertificateById = async (req,res)=>{
  try {
    const rawId = req.params.id || ""
    const certificateId = decodeURIComponent(rawId).trim()

    if (!certificateId) {
      return res.status(400).json({ success: false, message: "certificateId is required" })
    }

    // Find by the human-readable certificateId string, not Mongo _id
    const doc = await Certificate.findOne({ certificateId }).lean()

    if (!doc) {
      return res.status(404).json({ success: false, message: "Certificate not found" })
    }

    return res.status(200).json({ success: true, data: doc })
  } catch (err) {
    console.error("[getCertificateById] error:", err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}