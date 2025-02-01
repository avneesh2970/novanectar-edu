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

export const getAllUserMessages = async (req, res) => {
 try {
   const allMessages = await ClientMessage.find().sort({ createdAt: -1 });
   return res.status(200).json({success:true, data: allMessages})
 } catch (error) {
  console.log("error in getAllUsersMessages: ", error)
 }
};
