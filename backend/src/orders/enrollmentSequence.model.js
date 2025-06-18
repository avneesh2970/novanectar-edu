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
    year: {
      type: String,
      required: true,
    },
    currentNumber: {
      type: Number,
      default: 2500,
      // unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// 👇 This ensures one document per prefix-month-year
enrollmentSequenceSchema.index(
  { prefix: 1, month: 1, year: 1 },
  { unique: true }
);

const EnrollmentSequence = mongoose.model(
  "EnrollmentSequence",
  enrollmentSequenceSchema
);

export default EnrollmentSequence;
