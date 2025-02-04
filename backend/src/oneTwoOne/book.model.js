import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    domain: {
      type: String,
    },
    date: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
