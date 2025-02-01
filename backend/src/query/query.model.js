import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
},{timestamps:true});

export const Query = mongoose.model("Query", querySchema);
