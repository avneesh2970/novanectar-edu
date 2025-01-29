import ClientMessage from "./message.model.js";

export const userMessage = async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    if ((!name, !email, !contact, !subject, !message)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userMessage = await ClientMessage.create({
      name,
      email,
      contact,
      subject,
      message,
    });
    return res.status(201).json({ userMessage });
  } catch (error) {
    console.log("error in contacts: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
