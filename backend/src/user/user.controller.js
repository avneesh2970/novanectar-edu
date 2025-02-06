import { generateToken } from "../lib/generateToken.js";
import User from "./user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if ((!firstName, !lastName || !email || !password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        // profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "no user found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/////////////////////////////////////get user profile/////////////////////////////////////
// export const getUser = async (req, res) => {
//   try {
//     res.status(200).json({ ...req.user, isAuthenticated: true });
//   } catch (error) {
//     console.log("Error in checkAuth controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("enrollments.item")
      .exec();
    res.status(200).json({ ...user.toObject(), isAuthenticated: true });
  } catch (error) {
    console.log("Error in getUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    console.log("all users: ", user);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getAllUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
/////////////////////////////////////get user profile/////////////////////////////////////

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    const userId = req.user._id;

    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phoneNumber: phoneNumber || "" },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ ...req.user, isAuthenticated: true });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
