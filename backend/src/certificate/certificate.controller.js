import { Order } from "../orders/order.model.js";

export const getCertificate = async (req, res) => {
  try {
    const { uniqueId } = req.body;
    if (!uniqueId) {
      return res.status(400).json({ message: "uniqueId is required" });
    }
    const order = await Order.findOne({ courseId: uniqueId });
    if (!order) {
      return res.status(404).json({ message: "No certificate found" });
    }
    console.log("order: ", order);
    const dummyData = {
      id: uniqueId || "NN/IN/01/1000",
      name: "SHIKHA YADAV",
      course: "Web Development",
      organization: "NovaNectar Services Pvt. Ltd.",
      duration: "Three months Eighteen Days",
      startDate: "NOVEMBER 10, 2024",
      endDate: "MARCH 20, 2025",
    }
    return res.status(200).json({ data: dummyData });
  } catch (error) {
    console.log("error in getting certificate", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};
