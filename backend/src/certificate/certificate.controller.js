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
    return res.status(200).json({ data: order });
  } catch (error) {
    console.log("error in getting certificate", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};
