import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },

    enrollments: [
      {
        type: {
          type: String,
          enum: ["course", "internship"],
          required: true,
        },
        item: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // profilePic: {
    //   type: String,
    //   default: "",
    // },
    // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
