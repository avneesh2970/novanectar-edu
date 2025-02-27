import { Order } from "./order.model.js";
import { razorpay } from "./razorpay.config.js";
import crypto from "crypto";
import User from "../user/user.model.js";
import EnrollmentSequence from "./enrollmentSequence.model.js";
import CourseEnrollmentSequence from "./courseEnrollmentSeq.model.js";

import { sendEmail } from "../utils/email.config.js";
import { generateEnrollmentPDF } from "../utils/pdf.generator.js";
import mongoose from "mongoose";

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
      year: yearStr,
    });

    if (!sequenceTracker) {
      sequenceTracker = new EnrollmentSequence({
        prefix,
        month: monthStr,
        year: yearStr,
        currentNumber: 2500,
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
      year: yearStr,
    });

    if (!sequenceTracker) {
      sequenceTracker = new CourseEnrollmentSequence({
        prefix,
        month: monthStr,
        year: yearStr,
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

    let userId = req.user && req.user._id ? req.user._id : null;

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
        userId: userId || "",
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    console.log("razorpay order:", razorpayOrder);
    // Create order in database
    const order = new Order({
      courseId: generatedCourseId, //using generated id
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      userId: userId,
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

// Verify payment endpoint
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
    } = req.body;

    // Verify payment signature
    // const body = razorpay_order_id + "|" + razorpay_payment_id;
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    //   .update(body.toString())
    //   .digest("hex");

    // if (expectedSignature === razorpay_signature) {
    if (razorpay_payment_id) {
      // Update order status in database
      // const updatedOrder = await Order.findOneAndUpdate(
      //   { razorpayOrderId: razorpay_order_id },
      //   {
      //     razorpayPaymentId: razorpay_payment_id,
      //     status: "paid",
      //   },
      //   { new: true }
      // );
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          status: "paid",
        },
        { new: true }
      );

      // Only update user if userId exists and is valid
      let updatedUser = null;
      if (updatedOrder?.userId && updatedOrder?.userId !== "") {
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

      if (updatedUser || updatedUser === null) {
        const pdfBuffer = await generateEnrollmentPDF(
          updatedOrder,
          updatedUser
        );

        if (updatedOrder.orderType !== "course") {
          // Send email with new utility
          await sendEmail(
            updatedUser?.email || email,
            `${updatedOrder.orderType} Enrollment Confirmation 🎉`,
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #0066cc;">🎉 Congratulations! 🎉</h1>        
                <p>We are pleased to inform you that you have been selected for the <strong>NovaNectar Services Pvt. Ltd. Internship Program</strong>! 🚀</p>
                <p>Kindly check the attached <strong>Offer Letter</strong> for further details.</p>
                <p><strong>Tasks will be assigned to you soon.</strong></p>
        
                <h3>📌 Internship Guidelines:</h3>
                <ul>
                    <li><strong>LinkedIn Update:</strong> Update your LinkedIn profile and share your achievements (Offer Letter/Internship Completion Certificate). Tag <strong>@NovaNectar Services Pvt. Ltd.</strong> and use relevant hashtags: <strong>#NovaNectarServices</strong>.</li>
                    <li><strong>Task Completion Video:</strong> Share a proper video of the completed task on LinkedIn, tag <strong>@NovaNectar Services Pvt. Ltd.</strong>, and use relevant hashtags.</li>
                    <li><strong>GitHub Repository:</strong> Create a separate repository for each completed task. Upload all relevant files and share the link in your LinkedIn post and in the task completion form (to be shared later via email).</li>
                </ul>
        
                <h3 style="color: red;">⚠️ Important Notes:</h3>
                <ul>
                    <li>Failure to submit the <strong>elementary task</strong> will result in the <strong>cancellation of your internship</strong>.</li>
                    <li>Failure to complete any task will be considered an <strong>incomplete internship</strong>, and the certificate will not be issued.</li>
                    <li>Only candidates who complete all tasks within the given timeframe will receive the <strong>Internship Completion Certificate</strong>.</li>
                </ul>
        
                <hr style="border: 1px solid #eee; margin: 20px 0;">
        
                <p style="color: #666;">If you have any questions, feel free to contact us at:</p>
                <p><a href="mailto:internship@novanectar.co.in" style="color: #0066cc;">internship@novanectar.co.in</a></p>
        
              <div style="text-align: center; margin-top: 20px;">
                  <p style="font-size: 16px;"><strong>Follow us on:</strong></p>
                  <a href="https://www.facebook.com/share/a6ob9vX4d6uEAd3B/?mibextid=qi2Omg" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="30" style="vertical-align: middle;">
                  </a>
                  <a href="https://youtube.com/@novanectarservicespvt.ltd.?si=NVJY1MQc_NfoVoSi" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="YouTube" width="30" style="vertical-align: middle;">
                  </a>
                  <a href="https://www.linkedin.com/company/novanectar/" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" width="30" style="vertical-align: middle;">
                  </a>
                  <a href="https://www.instagram.com/novanectar_services_pvt.ltd?igsh=MXRoaHN3MGM5czYxZw==" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="30" style="vertical-align: middle;">
                  </a>
              </div>
                <div style="margin-top: 30px;">
                    <p>Best Regards,</p>
                    <p><strong>NovaNectar Team</strong></p>
                </div>
            </div>
            `,
            [
              {
                filename: "Offer_Letter.pdf",
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ]
          );
        } else {
          await sendEmail(
            updatedUser?.email || email,
            `${updatedOrder.orderType} enrollment confirmation`,
            `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h1 style="color: #0066cc;">🎉 Congratulations! 🎉</h1>        
    <p>We are thrilled to welcome you to <strong>${updatedOrder.courseTitle}</strong> at <strong>NovaNectar Services Private Limited</strong>! 🚀</p>
    
    <p>This course is designed to provide you with valuable knowledge and skills, and we are confident that you will have an enriching and rewarding experience.</p>

    <h3>📌 What to Expect:</h3>
    <ul>
        <li><strong>Comprehensive Learning:</strong> Engage in structured lessons and hands-on exercises tailored to enhance your skills.</li>
        <li><strong>Support & Guidance:</strong> Our team is here to assist you throughout the course whenever needed.</li>
        <li><strong>Exciting Opportunities:</strong> Apply your learning to real-world projects and build a strong foundation for your career.</li>
    </ul>

    <h3 style="color: red;">⚠️ Important Notes:</h3>
    <ul>
        <li>Stay committed and complete all modules within the given timeframe.</li>
        <li>Make sure to participate actively in discussions and assignments.</li>
        <li>Upon successful completion, you will receive a <strong>Certificate of Completion</strong>.</li>
    </ul>

    <hr style="border: 1px solid #eee; margin: 20px 0;">

    <p style="color: #666;">If you have any questions or need assistance, feel free to contact us at:</p>
    <p><a href="mailto:info@novanectar.co.in" style="color: #0066cc;">info@novanectar.co.in</a></p>

    <div style="margin-top: 30px;">
        <p>We’re excited to have you on board and look forward to seeing you succeed! 🚀</p>
        <p><strong>Best Regards,</strong></p>
        <p><strong>NovaNectar Team</strong></p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
                  <p style="font-size: 16px;"><strong>Follow us on:</strong></p>
                  <a href="https://www.facebook.com/share/a6ob9vX4d6uEAd3B/?mibextid=qi2Omg" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="30" style="vertical-align: middle;">
                  </a>
                  <a href="https://youtube.com/@novanectarservicespvt.ltd.?si=NVJY1MQc_NfoVoSi" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="YouTube" width="30" style="vertical-align: middle;">
                  </a>
                  <a href="https://www.linkedin.com/company/novanectar/" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" width="30" style="vertical-align: middle;">
                  </a>
                  <a href="https://www.instagram.com/novanectar_services_pvt.ltd?igsh=MXRoaHN3MGM5czYxZw==" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="30" style="vertical-align: middle;">
                  </a>
              </div>
</div>                   `
          );
        }
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
