import mongoose, { Mongoose, Schema } from "mongoose";

const contactsSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    city: {
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
  },
  {
    timestamps: true,
  }
);

const Contacts = mongoose.model("Contacts", contactsSchema);
export default Contacts;
