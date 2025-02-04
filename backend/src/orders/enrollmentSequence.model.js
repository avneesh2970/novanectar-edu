import mongoose from "mongoose";

const enrollmentSequenceSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      default: "NN",
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
enrollmentSequenceSchema.index({ prefix: 1, month: 1 }, { unique: true });

const EnrollmentSequence = mongoose.model(
  "EnrollmentSequence",
  enrollmentSequenceSchema
);

export default EnrollmentSequence;
