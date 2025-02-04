import mongoose from "mongoose";

const courseEnrollmentSequence = new mongoose.Schema(
  {
    prefix: {
      type: String,
      default: "TR",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    currentNumber: {
      type: Number,
      default: 1000,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure uniqueness of prefix and month combination
courseEnrollmentSequence.index({ prefix: 1, month: 1 }, { unique: true });

const CourseEnrollmentSequence = mongoose.model(
  "CourseEnrollmentSequence",
  courseEnrollmentSequence
);

export default CourseEnrollmentSequence;
