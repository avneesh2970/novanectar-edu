import { Order } from "../orders/order.model.js";
import { google } from "googleapis";

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

// export const exportGoogleSheet = async (req, res) => {
//   try {
//     const { data } = req.body;

//     // Set up Google Sheets API
//     const auth = new google.auth.GoogleAuth({
//       keyFile: "path/to/your/credentials.json", // You'll need to set this up
//       scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//     });

//     const sheets = google.sheets({ version: "v4", auth });

//     // Create a new spreadsheet
//     const spreadsheet = await sheets.spreadsheets.create({
//       requestBody: {
//         properties: {
//           title: "Filtered Enrollments",
//         },
//       },
//     });

//     const sheetId = spreadsheet.data.spreadsheetId;

//     // Prepare the data for Google Sheets
//     const values = [
//       [
//         "Internship ID",
//         "User Name",
//         "Logged In Email",
//         "Student Name",
//         "Student Email",
//         "Student Phone",
//         "Amount",
//         "Date",
//         "Type",
//         "Status",
//       ],
//       ...data.map(Object.values),
//     ];

//     // Write data to the sheet
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: sheetId,
//       range: "A1",
//       valueInputOption: "RAW",
//       requestBody: { values },
//     });

//     res.json({ success: true, sheetId });
//   } catch (error) {
//     console.error("Error exporting to Google Sheets:", error);
//     res.status(500).json({ success: false, error: "Failed to export data" });
//   }
// };
