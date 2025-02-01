import { Order } from "../orders/order.model.js";

export const getEnrollmentStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: "$orderType",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error("Error in getEnrollmentStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFilteredEnrollments = async (req, res) => {
  try {
    const { startDate, endDate, orderType } = req.query;

    const query = { status: "paid" };

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (orderType) {
      query.orderType = orderType;
    }

    const enrollments = await Order.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });
    console.log("enrollments", enrollments);
    res.json(enrollments);
  } catch (error) {
    console.error("Error in getFilteredEnrollments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
