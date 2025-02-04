import { Book } from "./book.model.js";

const bookSession = async (req, res) => {
  try {
    const { fullName, domain, date, email, message, phoneNumber, time } =
      req.body;
    if ((!fullName, !domain, !date, !email, !message, !phoneNumber, !time)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const book = await Book.create({
      fullName,
      domain,
      date,
      email,
      message,
      phoneNumber,
      time,
    });
    return res.status(200).json(book);
  } catch (error) {
    console.log("error in booking session: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getBookedSessions = async (req, res) => {
  try {
    const bookings = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    console.log("error in get booking session: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { bookSession, getBookedSessions };
