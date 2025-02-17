import { Order } from "./order.model.js";
import { razorpay } from "./razorpay.config.js";
import crypto from "crypto";
import User from "../user/user.model.js";
import EnrollmentSequence from "./enrollmentSequence.model.js";
import CourseEnrollmentSequence from "./courseEnrollmentSeq.model.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// Function to generate enrollment ID
const generateEnrollmentId = async (prefix = "NN") => {
  try {
    // Get current month (zero-padded)
    const currentMonth = new Date().getMonth() + 1;
    const monthStr = currentMonth.toString().padStart(2, "0");

    const currentYear = new Date().getFullYear();
    const yearStr = currentYear.toString().slice(-2);

    // Find or create sequence for the current month
    let sequenceTracker = await EnrollmentSequence.findOne({
      prefix,
      month: monthStr,
      year:yearStr,
    });

    if (!sequenceTracker) {
      sequenceTracker = new EnrollmentSequence({
        prefix,
        month: monthStr,
        year:yearStr,
        currentNumber: 2500,
      });
    } else {
      sequenceTracker.currentNumber += 1;
    }

    await sequenceTracker.save();

    // Generate the enrollment ID
    return `${prefix}/${monthStr}/${yearStr}${sequenceTracker.currentNumber}`;
  } catch (error) {
    console.error("Error generating enrollment ID:", error);
    // Fallback to a random number if generation fails
    return `${prefix}/${new Date().getMonth() + 1}/${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }
};

const generateCourseEnrollmentId = async (prefix = "TR") => {
  try {
    // Get current month (zero-padded)
    const currentMonth = new Date().getMonth() + 1;
    const monthStr = currentMonth.toString().padStart(2, "0");

    const currentYear = new Date().getFullYear();
    const yearStr = currentYear.toString().slice(-2);

    // Find or create sequence for the current month
    let sequenceTracker = await CourseEnrollmentSequence.findOne({
      prefix,
      month: monthStr,
      year:yearStr,
    });

    if (!sequenceTracker) {
      sequenceTracker = new CourseEnrollmentSequence({
        prefix,
        month: monthStr,
        year:yearStr,
        currentNumber: 1000,
      });
    } else {
      sequenceTracker.currentNumber += 1;
    }

    await sequenceTracker.save();

    // Generate the enrollment ID
    return `${prefix}/${monthStr}/${yearStr}/${sequenceTracker.currentNumber}`;
  } catch (error) {
    console.error("Error generating enrollment ID:", error);
    // Fallback to a random number if generation fails
    return `${prefix}/${new Date().getMonth() + 1}/${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }
};

// Create a transporter using SMTP
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com", //comment it
//   port: 587,   //comment it
//   secure: false,   //comment it
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", //comment it
  port: 465, //comment it
  secure: true, //comment it
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create order endpoint
const createOrder = async (req, res) => {
  try {
    const {
      // courseId,
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      amount,
      name,
      email,
      phone,
      orderType,
    } = req.body;
    const userId = req.user._id;
    // console.log("order-type:", orderType);

    let generatedCourseId;
    if (orderType === "course") {
      generatedCourseId = await generateCourseEnrollmentId("TR");
    } else {
      // Generate enrollment ID
      generatedCourseId = await generateEnrollmentId("NN");
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        courseId: generatedCourseId, //using generated it
        userId: userId,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    // Create order in database
    const order = new Order({
      courseId: generatedCourseId, //using generated id
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      userId,
      orderType,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
      name,
      email,
      phone,
    });

    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      courseId: generatedCourseId, // Return the generated ID
      orderType,
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      amount: amount * 100,
      currency: "INR",
      notes: options.notes,
      name,
      email,
      phone,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

//generate pdf function
async function generatePDF(updatedOrder, updatedUser) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument();
      const chunks = [];

      // Collect PDF data chunks
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Add content to PDF
      doc
        .fontSize(20)
        .text("Enrollment Confirmation", { align: "center" })
        .moveDown();

      doc
        .fontSize(14)
        // .text(`Order Type: ${orderData.orderType}`)
        .text(`Subject: Enrollment Confirmation – ${updatedOrder.courseTitle}`)
        .moveDown()
        // .text(`Amount Paid: ${orderData.amount} Rs`)
        .text(`Dear: ${updatedUser.firstName}`)

        .moveDown()
        // .text(`Order ID: ${orderData.razorpayOrderId}`)
        .text(
          `Congratulations! 🎉 You have successfully enrolled in ${updatedOrder.courseTitle}.`
        )
        .moveDown()
        // .text(`Payment ID: ${orderData.razorpayPaymentId}`)
        .text(`Your Unique Enrollment ID: ${updatedOrder.courseId}`)
        .moveDown()
        // .text(`Course Title: ${orderData.courseTitle}`)
        .text(
          `If you have any questions, feel free to contact us at info@novanectar.co.in`
        )
        .moveDown()
        // .text(`Enrollment ID: ${orderData.courseId}`)
        .text(`Best Regards,`)
        .moveDown()
        .text(`Novanectar`)
        .moveDown()
        .moveDown()
        .fontSize(12)
        .text("Thank you for choosing our service!", { align: "center" });

      // Add company logo or additional styling as needed
      // doc.image('path/to/logo.png', 50, 45, { width: 50 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Verify payment endpoint
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update order status in database
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          status: "paid",
        },
        { new: true }
      );

      let updatedUser = null;
      if (updatedOrder) {
        // Add the enrollment to the user's schema
        updatedUser = await User.findByIdAndUpdate(
          updatedOrder.userId,
          {
            $push: {
              enrollments: {
                type: updatedOrder.orderType,
                item: updatedOrder._id,
              },
            },
          },
          { new: true }
        );
      }

      // Add logic to send custom email
      try {
        console.log("testing email send process 1");

        // Generate PDF
        const pdfBuffer = await generatePDF(updatedOrder, updatedUser);

        if (updatedUser) {
          await transporter.sendMail({
            from: '"Novanectar" <internship.novanectar@gmail.com>',
            to: updatedUser.email,
            subject: `${updatedOrder.orderType} enrollment confirmation`,
            html: `
              <h1>Thank you for your purchase!</h1>
              <h1>Congratulations! 🎉 You have successfully enrolled in ${updatedOrder.courseTitle}.</h1>
              <p>Enrollment id: ${updatedOrder.courseId}</p>
              <p>Thank you for choosing our service!</p>            
              <p>Best Regards,</p>            
              <p>Novanectar</p>            `,

            attachments: [
              {
                filename: "enrollment-confirmation.pdf",
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ],
          });
          console.log("Email sent successfully with pdf attachment");
        }
      } catch (error) {
        console.log("error in sending mail: ", error);
      }

      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export { createOrder, verifyPayment };
