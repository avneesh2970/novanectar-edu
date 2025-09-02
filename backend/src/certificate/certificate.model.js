import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String, // Example: NN/IN/01/1000 or NN/TR/01/2000
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Training"],
      required: true,
    },
    name: {
      type: String, // Student/trainee name
      required: true,
    },
    programTitle: {
      type: String, // Example: Web Development, MERN Stack, Full Stack Training
      required: true,
    },
    mode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      default: "Offline",
    },
    company: {
      type: String,
      default: "NovaNectar Services Pvt. Ltd.",
    },
    duration: {
      months: { type: Number, required: true },
      days: { type: Number, required: true },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: String,
      default: "Chief Executive Officer",
    },
    status: {
      type: String,
      enum: ["Active", "Revoked"],
      default: "Active",
    },
    certificateImage: {
      type: String, // store URL (Cloudinary, AWS S3, etc.) or local path
      required: false,
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
