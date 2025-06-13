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
      duration
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

    const razorpayOrder = await razorpay.orders.create(options);    // Create order in database
    const order = new Order({
      courseId: generatedCourseId, //using generated id
      courseName,
      courseTitle,
      courseDescription,
      courseImage,
      userId: userId,
      orderType,
      duration,
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
                <div style="background-color: #25D366; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📱 JOIN OUR WHATSAPP CHANNEL (COMPULSORY)</h3>
        <p>It is <strong>mandatory</strong> to join our official WhatsApp channel for important updates and announcements:</p>
        <!-- Styled button-like link for easy access -->
        <a href="https://whatsapp.com/channel/0029VatOLnTLCoX6Ut8Lca2L" 
           style="background-color: white; color: #25D366; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 5px;">
           Join NovaNectar WhatsApp Channel
        </a>
        </div>
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
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="30" style="vertical-align: middle;">
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
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="30" style="vertical-align: middle;">
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

// import { Order } from "./order.model.js";
// import { razorpay } from "./razorpay.config.js";
// import crypto from "crypto";
// import User from "../user/user.model.js";
// import EnrollmentSequence from "./enrollmentSequence.model.js";
// import CourseEnrollmentSequence from "./courseEnrollmentSeq.model.js";
// import { sendEmail } from "../utils/email.config.js";
// import { generateEnrollmentPDF } from "../utils/pdf.generator.js";
// import mongoose from "mongoose";

// // Create FailedOperation model for tracking failed email/PDF deliveries
// const FailedOperationSchema = new mongoose.Schema({
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
//   email: { type: String, required: true },
//   operationType: { type: String, enum: ['PDF_GENERATION', 'EMAIL_SENDING', 'BOTH'], required: true },
//   errorMessage: { type: String, required: true },
//   retryCount: { type: Number, default: 0 },
//   maxRetries: { type: Number, default: 3 },
//   status: { type: String, enum: ['PENDING', 'RETRYING', 'RESOLVED', 'FAILED'], default: 'PENDING' },
//   createdAt: { type: Date, default: Date.now },
//   lastRetryAt: { type: Date },
//   resolvedAt: { type: Date }
// });

// const FailedOperation = mongoose.model('FailedOperation', FailedOperationSchema);

// // Function to generate enrollment ID with better error handling
// const generateEnrollmentId = async (prefix = "NN") => {
//   const session = await mongoose.startSession();
  
//   try {
//     await session.startTransaction();
    
//     const currentMonth = new Date().getMonth() + 1;
//     const monthStr = currentMonth.toString().padStart(2, "0");
//     const currentYear = new Date().getFullYear();
//     const yearStr = currentYear.toString().slice(-2);

//     let sequenceTracker = await EnrollmentSequence.findOne({
//       prefix,
//       month: monthStr,
//       year: yearStr,
//     }).session(session);

//     if (!sequenceTracker) {
//       sequenceTracker = new EnrollmentSequence({
//         prefix,
//         month: monthStr,
//         year: yearStr,
//         currentNumber: 2500,
//       });
//     } else {
//       sequenceTracker.currentNumber += 1;
//     }

//     await sequenceTracker.save({ session });
//     await session.commitTransaction();

//     const enrollmentId = `${prefix}/${monthStr}/${yearStr}/${sequenceTracker.currentNumber}`;
//     console.log(`✅ Generated enrollment ID: ${enrollmentId}`);
    
//     return enrollmentId;
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("❌ Error generating enrollment ID:", error);
    
//     // Fallback with timestamp to ensure uniqueness
//     const fallbackId = `${prefix}/${new Date().getMonth() + 1}/${Date.now()}/${Math.floor(1000 + Math.random() * 9000)}`;
//     console.log(`⚠️ Using fallback enrollment ID: ${fallbackId}`);
    
//     return fallbackId;
//   } finally {
//     session.endSession();
//   }
// };

// const generateCourseEnrollmentId = async (prefix = "TR") => {
//   const session = await mongoose.startSession();
  
//   try {
//     await session.startTransaction();
    
//     const currentMonth = new Date().getMonth() + 1;
//     const monthStr = currentMonth.toString().padStart(2, "0");
//     const currentYear = new Date().getFullYear();
//     const yearStr = currentYear.toString().slice(-2);

//     let sequenceTracker = await CourseEnrollmentSequence.findOne({
//       prefix,
//       month: monthStr,
//       year: yearStr,
//     }).session(session);

//     if (!sequenceTracker) {
//       sequenceTracker = new CourseEnrollmentSequence({
//         prefix,
//         month: monthStr,
//         year: yearStr,
//         currentNumber: 1000,
//       });
//     } else {
//       sequenceTracker.currentNumber += 1;
//     }

//     await sequenceTracker.save({ session });
//     await session.commitTransaction();

//     const enrollmentId = `${prefix}/${monthStr}/${yearStr}/${sequenceTracker.currentNumber}`;
//     console.log(`✅ Generated course enrollment ID: ${enrollmentId}`);
    
//     return enrollmentId;
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("❌ Error generating course enrollment ID:", error);
    
//     // Fallback with timestamp to ensure uniqueness
//     const fallbackId = `${prefix}/${new Date().getMonth() + 1}/${Date.now()}/${Math.floor(1000 + Math.random() * 9000)}`;
//     console.log(`⚠️ Using fallback course enrollment ID: ${fallbackId}`);
    
//     return fallbackId;
//   } finally {
//     session.endSession();
//   }
// };

// // Create order endpoint with improved error handling
// const createOrder = async (req, res) => {
//   try {
//     console.log(`🚀 Creating order for: ${req.body.email}`);
    
//     const {
//       courseName,
//       courseTitle,
//       courseDescription,
//       courseImage,
//       amount,
//       name,
//       email,
//       phone,
//       orderType,
//       duration
//     } = req.body;

//     // Validate required fields
//     if (!courseName || !courseTitle || !amount || !name || !email || !phone || !orderType) {
//       console.log(`❌ Missing required fields for order creation`);
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Validate email format
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       console.log(`❌ Invalid email format: ${email}`);
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Validate phone format (10 digits)
//     if (!/^\d{10}$/.test(phone)) {
//       console.log(`❌ Invalid phone format: ${phone}`);
//       return res.status(400).json({ error: "Invalid phone number format" });
//     }

//     // Validate amount
//     if (isNaN(amount) || amount <= 0) {
//       console.log(`❌ Invalid amount: ${amount}`);
//       return res.status(400).json({ error: "Invalid amount" });
//     }

//     let userId = req.user && req.user._id ? req.user._id : null;
//     console.log(`👤 User ID: ${userId || 'Guest user'}`);

//     // Generate enrollment ID based on order type
//     let generatedCourseId;
//     if (orderType === "course") {
//       generatedCourseId = await generateCourseEnrollmentId("TR");
//     } else {
//       generatedCourseId = await generateEnrollmentId("NN");
//     }

//     // Create Razorpay order
//     const options = {
//       amount: amount * 100, // Amount in smallest currency unit (paise)
//       currency: "INR",
//       receipt: `receipt_${Date.now()}_${generatedCourseId}`,
//       payment_capture: 1,
//       notes: {
//         courseId: generatedCourseId,
//         userId: userId || "",
//         orderType: orderType,
//         email: email
//       },
//     };

//     console.log(`💳 Creating Razorpay order with amount: ₹${amount}`);
//     const razorpayOrder = await razorpay.orders.create(options);
//     console.log(`✅ Razorpay order created: ${razorpayOrder.id}`);

//     // Create order in database
//     const order = new Order({
//       courseId: generatedCourseId,
//       courseName,
//       courseTitle,
//       courseDescription,
//       courseImage,
//       userId: userId,
//       orderType,
//       duration,
//       amount,
//       razorpayOrderId: razorpayOrder.id,
//       status: "created",
//       name,
//       email,
//       phone,
//       createdAt: new Date(),
//     });

//     await order.save();
//     console.log(`✅ Order saved to database: ${order._id}`);

//     res.json({
//       orderId: razorpayOrder.id,
//       courseId: generatedCourseId,
//       orderType,
//       courseName,
//       courseTitle,
//       courseDescription,
//       courseImage,
//       amount: amount * 100,
//       currency: "INR",
//       notes: options.notes,
//       name,
//       email,
//       phone,
//     });

//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     res.status(500).json({ 
//       error: "Failed to create order",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Email content templates
// const getInternshipEmailContent = (order) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
//         <h1 style="color: #0066cc;">🎉 Congratulations! ��</h1>        
//         <p>We are pleased to inform you that you have been selected for the <strong>NovaNectar Services Pvt. Ltd. Internship Program</strong>! 🚀</p>
//         <p>Kindly check the attached <strong>Offer Letter</strong> for further details.</p>
//         <p><strong>Tasks will be assigned to you soon.</strong></p>
//         <div style="background-color: #25D366; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="margin-top: 0;">📱 JOIN OUR WHATSAPP CHANNEL (COMPULSORY)</h3>
//             <p>It is <strong>mandatory</strong> to join our official WhatsApp channel for important updates and announcements:</p>
//             <a href="https://whatsapp.com/channel/0029VatOLnTLCoX6Ut8Lca2L" 
//                style="background-color: white; color: #25D366; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 5px;">
//                Join NovaNectar WhatsApp Channel
//             </a>
//         </div>
//         <h3>📌 Internship Guidelines:</h3>
//         <ul>
//             <li><strong>LinkedIn Update:</strong> Update your LinkedIn profile and share your achievements (Offer Letter/Internship Completion Certificate). Tag <strong>@NovaNectar Services Pvt. Ltd.</strong> and use relevant hashtags: <strong>#NovaNectarServices</strong>.</li>
//             <li><strong>Task Completion Video:</strong> Share a proper video of the completed task on LinkedIn, tag <strong>@NovaNectar Services Pvt. Ltd.</strong>, and use relevant hashtags.</li>
//             <li><strong>GitHub Repository:</strong> Create a separate repository for each completed task. Upload all relevant files and share the link in your LinkedIn post and in the task completion form (to be shared later via email).</li>
//         </ul>
//         <h3 style="color: red;">⚠️ Important Notes:</h3>
//         <ul>
//             <li>Failure to submit the <strong>elementary task</strong> will result in the <strong>cancellation of your internship</strong>.</li>
//             <li>Failure to complete any task will be considered an <strong>incomplete internship</strong>, and the certificate will not be issued.</li>
//             <li>Only candidates who complete all tasks within the given timeframe will receive the <strong>Internship Completion Certificate</strong>.</li>
//         </ul>
//         <hr style="border: 1px solid #eee; margin: 20px 0;">
//         <p style="color: #666;">If you have any questions, feel free to contact us at:</p>
//         <p><a href="mailto:internship@novanectar.co.in" style="color: #0066cc;">internship@novanectar.co.in</a></p>
//         <div style="text-align: center; margin-top: 20px;">
//             <p style="font-size: 16px;"><strong>Follow us on:</strong></p>
//             <a href="https://www.facebook.com/share/a6ob9vX4d6uEAd3B/?mibextid=qi2Omg" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="30" style="vertical-align: middle;">
//             </a>
//             <a href="https://youtube.com/@novanectarservicespvt.ltd.?si=NVJY1MQc_NfoVoSi" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="30" style="vertical-align: middle;">
//             </a>
//             <a href="https://www.linkedin.com/company/novanectar/" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" width="30" style="vertical-align: middle;">
//             </a>
//             <a href="https://www.instagram.com/novanectar_services_pvt.ltd?igsh=MXRoaHN3MGM5czYxZw==" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="30" style="vertical-align: middle;">
//             </a>
//         </div>
//         <div style="margin-top: 30px;">
//             <p>Best Regards,</p>
//             <p><strong>NovaNectar Team</strong></p>
//         </div>
//     </div>
//   `;
// };

// const getCourseEmailContent = (order) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
//         <h1 style="color: #0066cc;">🎉 Congratulations! 🎉</h1>        
//         <p>We are thrilled to welcome you to <strong>${order.courseTitle}</strong> at <strong>NovaNectar Services Private Limited</strong>! 🚀</p>
//         <p>This course is designed to provide you with valuable knowledge and skills, and we are confident that you will have an enriching and rewarding experience.</p>
//         <h3>📌 What to Expect:</h3>
//         <ul>
//             <li><strong>Comprehensive Learning:</strong> Engage in structured lessons and hands-on exercises tailored to enhance your skills.</li>
//             <li><strong>Support & Guidance:</strong> Our team is here to assist you throughout the course whenever needed.</li>
//             <li><strong>Exciting Opportunities:</strong> Apply your learning to real-world projects and build a strong foundation for your career.</li>
//         </ul>
//         <h3 style="color: red;">⚠️ Important Notes:</h3>
//         <ul>
//             <li>Stay committed and complete all modules within the given timeframe.</li>
//             <li>Make sure to participate actively in discussions and assignments.</li>
//             <li>Upon successful completion, you will receive a <strong>Certificate of Completion</strong>.</li>
//         </ul>
//         <hr style="border: 1px solid #eee; margin: 20px 0;">
//         <p style="color: #666;">If you have any questions or need assistance, feel free to contact us at:</p>
//         <p><a href="mailto:info@novanectar.co.in" style="color: #0066cc;">info@novanectar.co.in</a></p>
//         <div style="margin-top: 30px;">
//             <p>We're excited to have you on board and look forward to seeing you succeed! 🚀</p>
//             <p><strong>Best Regards,</strong></p>
//             <p><strong>NovaNectar Team</strong></p>
//         </div>
//         <div style="text-align: center; margin-top: 20px;">
//             <p style="font-size: 16px;"><strong>Follow us on:</strong></p>
//             <a href="https://www.facebook.com/share/a6ob9vX4d6uEAd3B/?mibextid=qi2Omg" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="30" style="vertical-align: middle;">
//             </a>
//             <a href="https://youtube.com/@novanectarservicespvt.ltd.?si=NVJY1MQc_NfoVoSi" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="30" style="vertical-align: middle;">
//             </a>
//             <a href="https://www.linkedin.com/company/novanectar/" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" width="30" style="vertical-align: middle;">
//             </a>
//             <a href="https://www.instagram.com/novanectar_services_pvt.ltd?igsh=MXRoaHN3MGM5czYxZw==" target="_blank" style="margin: 0 10px; text-decoration: none;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="30" style="vertical-align: middle;">
//             </a>
//         </div>
//     </div>
//   `;
// };

// // Function to handle post-payment operations with retry mechanism
// const handlePostPaymentOperations = async (order, user, email, retryCount = 0) => {
//   const MAX_RETRIES = 3;
//   const orderId = order._id;
  
//   try {
//     console.log(`📄 Starting PDF generation for order: ${orderId} (attempt ${retryCount + 1})`);
    
//     // Generate PDF with timeout protection
//     const pdfBuffer = await Promise.race([
//       generateEnrollmentPDF(order, user),
//       new Promise((_, reject) => 
//         setTimeout(() => reject(new Error("PDF generation timeout after 30 seconds")), 30000)
//       )
//     ]);

//     console.log(`✅ PDF generated successfully for order: ${orderId}`);

//     // Send email with retry mechanism
//     await sendEmailWithRetry(order, user, email, pdfBuffer);
    
//     console.log(`✅ Email sent successfully for order: ${orderId}`);

//     // Mark any existing failed operations as resolved
//     await FailedOperation.updateMany(
//       { orderId: orderId, status: { $in: ['PENDING', 'RETRYING'] } },
//       { 
//         status: 'RESOLVED', 
//         resolvedAt: new Date() 
//       }
//     );

//   } catch (error) {
//     console.error(`❌ Post-payment operation failed for order ${orderId} (attempt ${retryCount + 1}):`, error.message);
    
//     if (retryCount < MAX_RETRIES) {
//       console.log(`🔄 Retrying post-payment operations for order ${orderId}... (attempt ${retryCount + 2})`);
      
//       // Exponential backoff: 2^retryCount seconds
//       const delay = Math.pow(2, retryCount) * 1000;
//       await new Promise(resolve => setTimeout(resolve, delay));
      
//       return handlePostPaymentOperations(order, user, email, retryCount + 1);
//     } else {
//       // Log critical failure for manual intervention
//       console.error(`🚨 CRITICAL: Failed to send PDF after ${MAX_RETRIES} attempts for order: ${orderId}`);
      
//       // Store failed operation for manual retry
//       await logFailedOperation(orderId, user?.email || email, error.message, 'BOTH');
      
//       // Don't throw error - payment was successful, just email failed
//       console.log(`⚠️ Payment successful but email delivery failed for order: ${orderId}`);
//     }
//   }
// };

// // Email sending with retry mechanism
// const sendEmailWithRetry = async (order, user, email, pdfBuffer, retryCount = 0) => {
//   const MAX_EMAIL_RETRIES = 2;
  
//   try {
//     const emailContent = order.orderType !== "course" ? 
//       getInternshipEmailContent(order) : 
//       getCourseEmailContent(order);

//     const subject = `${order.orderType} Enrollment Confirmation 🎉`;
//     const attachments = [{
//       filename: order.orderType !== "course" ? "Offer_Letter.pdf" : "Course_Enrollment.pdf",
//       content: pdfBuffer,
//       contentType: "application/pdf",
//     }];

//     await sendEmail(
//       user?.email || email,
//       subject,
//       emailContent,
//       attachments
//     );

//   } catch (error) {
//     console.error(`❌ Email sending failed (attempt ${retryCount + 1}):`, error.message);
    
//     if (retryCount < MAX_EMAIL_RETRIES) {
//       console.log(`🔄 Retrying email send... (attempt ${retryCount + 2})`);
//       await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
//       return sendEmailWithRetry(order, user, email, pdfBuffer, retryCount + 1);
//     } else {
//       throw new Error(`Email sending failed after ${MAX_EMAIL_RETRIES + 1} attempts: ${error.message}`);
//     }
//   }
// };

// // Log failed operations for manual intervention
// const logFailedOperation = async (orderId, email, errorMessage, operationType = 'BOTH') => {
//   try {
//     const failedOp = new FailedOperation({
//       orderId,
//       email,
//       operationType,
//       errorMessage,
//       status: 'PENDING'
//     });
    
//     await failedOp.save();
//     console.log(`📝 Logged failed operation for manual retry: ${failedOp._id}`);
    
//     // TODO: Send admin alert email here
//     // await sendAdminAlert(orderId, email, errorMessage);
    
//   } catch (logError) {
//     console.error("❌ Failed to log failed operation:", logError);
//   }
// };

// // FIXED: Verify payment endpoint with proper security and error handling
// const verifyPayment = async (req, res) => {
//   const session = await mongoose.startSession();
  
//   try {
//     await session.startTransaction();
    
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       email,
//     } = req.body;

//     console.log(`🔍 Verifying payment for order: ${razorpay_order_id}`);

//     // Validate required fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       console.log(`❌ Missing required payment parameters`);
//       await session.abortTransaction();
//       return res.status(400).json({ error: "Missing required payment parameters" });
//     }

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       console.log(`❌ Invalid email format: ${email}`);
//       await session.abortTransaction();
//       return res.status(400).json({ error: "Valid email is required" });
//     }

//     // CRITICAL FIX: Enable payment signature verification
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       console.log(`❌ Invalid payment signature for order: ${razorpay_order_id}`);
//       await session.abortTransaction();
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     console.log(`✅ Payment signature verified for order: ${razorpay_order_id}`);

//     // Check if payment is already processed (idempotency)
//     const existingOrder = await Order.findOne({ 
//       razorpayOrderId: razorpay_order_id,
//       status: "paid"
//     }).session(session);

//     if (existingOrder) {
//       console.log(`⚠️ Payment already processed for order: ${razorpay_order_id}`);
//       await session.commitTransaction();
//       return res.json({ success: true, message: "Payment already processed" });
//     }

//     // Update order status in database
//     const updatedOrder = await Order.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         razorpayPaymentId: razorpay_payment_id,
//         razorpaySignature: razorpay_signature,
//         status: "paid",
//         paidAt: new Date(),
//       },
//       { new: true, session }
//     );

//     if (!updatedOrder) {
//       console.log(`❌ Order not found: ${razorpay_order_id}`);
//       await session.abortTransaction();
//       return res.status(404).json({ error: "Order not found" });
//     }

//     console.log(`✅ Order updated successfully: ${updatedOrder._id}`);

//     // Update user enrollment if user exists
//     let updatedUser = null;
//     if (updatedOrder?.userId && updatedOrder?.userId !== "") {
//       try {
//         updatedUser = await User.findByIdAndUpdate(
//           updatedOrder.userId,
//           {
//             $push: {
//               enrollments: {
//                 type: updatedOrder.orderType,
//                 item: updatedOrder._id,
//                 enrolledAt: new Date()
//               },
//             },
//           },
//           { new: true, session }
//         );
//         console.log(`✅ User enrollment updated: ${updatedUser._id}`);
//       } catch (userError) {
//         console.error(`⚠️ Failed to update user enrollment:`, userError);
//         // Continue with payment processing even if user update fails
//       }
//     }

//     // Commit transaction before PDF/Email operations
//     await session.commitTransaction();
//     console.log(`✅ Database transaction committed for order: ${updatedOrder._id}`);

//     // Handle PDF generation and email sending asynchronously
//     // Don't await this to avoid blocking the response
//     handlePostPaymentOperations(updatedOrder, updatedUser, email)
//       .catch(error => {
//         console.error(`❌ Post-payment operations failed for order ${updatedOrder._id}:`, error);
//       });

//     // Return success immediately after payment verification
//     res.json({ 
//       success: true, 
//       orderId: updatedOrder._id,
//       message: "Payment verified successfully. Confirmation email will be sent shortly."
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     console.error("❌ Payment verification failed:", error);
    
//     res.status(500).json({ 
//       error: "Payment verification failed",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   } finally {
//     session.endSession();
//   }
// };

// // New function to manually retry failed email deliveries (for admin use)
// const retryFailedOperation = async (req, res) => {
//   try {
//     const { failedOperationId } = req.params;
    
//     const failedOp = await FailedOperation.findById(failedOperationId).populate('orderId');
    
//     if (!failedOp) {
//       return res.status(404).json({ error: "Failed operation not found" });
//     }

//     if (failedOp.status === 'RESOLVED') {
//       return res.json({ success: true, message: "Operation already resolved" });
//     }

//     const order = failedOp.orderId;
//     let user = null;
    
//     if (order.userId) {
//       user = await User.findById(order.userId);
//     }

//     console.log(`🔄 Manually retrying failed operation: ${failedOperationId}`);

//     // Update retry count and status
//     failedOp.retryCount += 1;
//     failedOp.status = 'RETRYING';
//     failedOp.lastRetryAt = new Date();
//     await failedOp.save();

//     // Retry the operation
//     await handlePostPaymentOperations(order, user, failedOp.email, 0);

//     res.json({ success: true, message: "Retry initiated successfully" });

//   } catch (error) {
//     console.error("❌ Manual retry failed:", error);
//     res.status(500).json({ error: "Manual retry failed", details: error.message });
//   }
// };

// // Get failed operations for admin dashboard
// const getFailedOperations = async (req, res) => {
//   try {
//     const { status = 'PENDING', page = 1, limit = 10 } = req.query;
    
//     const failedOps = await FailedOperation.find({ status })
//       .populate('orderId')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await FailedOperation.countDocuments({ status });

//     res.json({
//       success: true,
//       data: failedOps,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });

//   } catch (error) {
//     console.error("❌ Failed to get failed operations:", error);
//     res.status(500).json({ error: "Failed to get failed operations" });
//   }
// };

// export { 
//   createOrder, 
//   verifyPayment, 
//   retryFailedOperation, 
//   getFailedOperations,
//   FailedOperation // Export for use in other files
// };