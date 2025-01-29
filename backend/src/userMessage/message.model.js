import mongoose from "mongoose";

// Define the schema
const clientMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

// Create the model
const ClientMessage = mongoose.model("ClientMessage", clientMessageSchema);
export default ClientMessage;
