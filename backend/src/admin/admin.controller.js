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
    const enrollmentsQuery = Order.find(query);
    // Check if UserId exists and is valid before populating
    if (
      req.query.UserId &&
      typeof req.query.UserId === "string" &&
      req.query.UserId.trim() !== ""
    ) {
      enrollmentsQuery.populate("UserId", "firstName lastName email");
    }

    const enrollments = await enrollmentsQuery.sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error("Error in getFilteredEnrollments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
