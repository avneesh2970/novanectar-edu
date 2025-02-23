import PDFDocument from "pdfkit";
import fetch from "node-fetch";

async function getImageBuffer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

async function generateEnrollmentPDF(orderData, userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const [
        logoBuffer,
        signatureBuffer,
        stampBuffer,
        startupBuffer,
        msmeBuffer,
        governmentBuffer,
        isoBuffer,
        addressIconBuffer,
        emailIconBuffer,
        phoneIconBuffer,
        websiteIconBuffer,
      ] = await Promise.all([
        getImageBuffer("https://novanectar.co.in/logo.png"),
        getImageBuffer("https://edu.novanectar.co.in/signature.png"),
        getImageBuffer("https://edu.novanectar.co.in/stamp.png"),
        getImageBuffer("https://edu.novanectar.co.in/startup.png"),
        getImageBuffer("https://edu.novanectar.co.in/msme.png"),
        getImageBuffer("https://edu.novanectar.co.in/government.png"),
        getImageBuffer("https://edu.novanectar.co.in/iso.png"),
        getImageBuffer("https://edu.novanectar.co.in/location.png"),
        getImageBuffer("https://edu.novanectar.co.in/email.png"),
        getImageBuffer("https://edu.novanectar.co.in/phone.png"),
        getImageBuffer("https://edu.novanectar.co.in/website.png"),
      ]);

      // Create PDF with improved margins and metadata
      const doc = new PDFDocument({
        size: "A4",
        margin: 60,
        info: {
          Title: "Enrollment Confirmation",
          Author: "Novanectar Services Private Limited",
          Subject: "Internship Enrollment",
          Keywords: "internship, enrollment, confirmation",
          CreationDate: new Date(),
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Utility function for safely adding images
      const safelyAddImage = (buffer, x, y, options) => {
        if (
          buffer &&
          typeof x === "number" &&
          !isNaN(x) &&
          typeof y === "number" &&
          !isNaN(y)
        ) {
          try {
            doc.image(buffer, x, y, options);
          } catch (error) {
            console.error("Error adding image:", error);
            doc.text(options.fallback || "[Image]", x, y);
          }
        } else {
          doc.text(options.fallback || "[Image]", x || 50, y || doc.y);
        }
      };

      // Calculate page dimensions
      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const centerX = doc.page.margins.left + pageWidth / 2;

      // ============= HEADER SECTION =============
      // Add a subtle header border
      // doc
      //   .lineWidth(0.5)
      //   .strokeColor("#E0E0E0")
      //   .roundedRect(doc.page.margins.left, 35, pageWidth, 80, 5)
      //   .stroke();

      if (logoBuffer) {
        const pageWidth = doc.page.width;
        const imageWidth = 190; // Keep original width
        const xPos = (pageWidth - imageWidth) / 2; // Centering the image

        safelyAddImage(logoBuffer, xPos, 45, {
          width: imageWidth,
          height: 60, // Keep original height
          fallback: "Novanectar",
        });
      }

      // Enrollment Confirmation
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("", doc.page.width - doc.page.margins.right - 230, 65, {
          align: "right",
        });

      doc.moveDown(6);

      // ============= DOCUMENT INFO SECTION =============
      // Add styled document ID
      doc
        .roundedRect(doc.page.margins.left, doc.y - 5, 180, 30, 3)
        .fillAndStroke("#FFF", "#FFF");

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(`ID: ${orderData?.courseId}`, doc.page.margins.left, doc.y - 24);

      // Add current date on right
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(
          `Date: ${new Date().toLocaleDateString("en-GB")}`,
          doc.page.width - doc.page.margins.right - 101,
          doc.y - 20,
          { align: "right" }
        );

      // ============= GREETING SECTION =============
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(`Dear ${userData?.firstName || "Sir/Madam"},`, { align: "left" })
        .moveDown(2);

      // ============= CONTENT SECTION =============
      // Main content with improved styling
      doc.fontSize(14).font("Helvetica").fillColor("#000000").lineGap(4);

      doc
        .text(
          `Congratulations! We are pleased to offer you offline ${orderData.orderType}, for the role of `,
          doc.page.margins.left,
          doc.y,
          { continued: true }
        )
        .fontSize(14);

      doc
        .font("Helvetica-Bold")
        .fillColor("#16A085")
        .text(`${orderData?.courseName}`, { continued: true });

      doc
        .font("Helvetica")
        .fillColor("#000000")
        .text(
          `. The date of commencement of your internship is ${new Date().toLocaleDateString(
            "en-GB"
          )}.`,
          { align: "left" }
        );

      doc.moveDown(1);

      // Second paragraph
      doc
        .font("Helvetica")
        .fillColor("#000000")
        .fontSize(14)
        .text(
          `As an enrolee, you will get the opportunity to gain valuable and hands-on experience. Please note that as a temporary employee, you will not be eligible for the benefits that our regular employees receive. We expect you to comply with our company policies and practices including those related to code of conduct, safety and confidentiality.`,
          { align: "left", lineGap: 5 }
        )
        .moveDown(1);

      // Third paragraph with emphasis
      doc
        .text(
          `As we welcome you onboard, we assure you that your internship with `,
          { continued: true }
        )
        .fontSize(14);

      doc
        .font("Helvetica-Bold")
        .fillColor("#16A085")
        .text("Novanectar Services Private Limited", { continued: true });

      doc
        .font("Helvetica")
        .fillColor("#000000")
        .text(
          " will be rewarding and fruitful. Wishing you all the very best.",
          { align: "left", lineGap: 5 }
        )
        .fontSize(14);

      // ============= SIGNATURE SECTION =============
      doc
        // .moveDown(3)
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#000000")
        .text("Regards,", { align: "left" });

      const signatureY = doc.y;

      // Add signature with improved positioning
      safelyAddImage(signatureBuffer, doc.page.margins.left + 45, signatureY, {
        width: 100,
        height: 40,
        fallback: "[Signature]",
      });

      doc
        .moveDown(0.3)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Shivam Rai,", { align: "left" })
        .font("Helvetica")
        .text("CEO", { align: "left" });

      // Add stamp with improved positioning
      safelyAddImage(
        stampBuffer,
        doc.page.width - doc.page.margins.left - 80,
        signatureY - 10,
        {
          width: 70,
          height: 70,
          fallback: "[Company Stamp]",
        }
      );

      // ============= CERTIFICATION LOGOS SECTION =============
      doc.moveDown(1);

      // Add a border for certification section
      const certSectionY = doc.y;
      // doc
      //   .roundedRect(doc.page.margins.left, certSectionY - 5, pageWidth, 70, 3)
      //   .fillAndStroke("#F8F9FA", "#E0E0E0");

      const logoY = certSectionY + 20;
      const logoWidth = 100;
      const logoHeight = 60;
      const logoSpacing = 30;
      const totalLogosWidth = logoWidth * 4 + logoSpacing * 3;
      const startX = doc.page.margins.left + (pageWidth - totalLogosWidth) / 2;

      const certLogoOptions = {
        width: logoWidth,
        height: logoHeight,
        align: "center",
        valign: "center",
      };

      safelyAddImage(startupBuffer, startX, logoY, certLogoOptions);
      safelyAddImage(
        msmeBuffer,
        startX + logoWidth + logoSpacing,
        logoY,
        certLogoOptions
      );
      safelyAddImage(
        governmentBuffer,
        startX + (logoWidth + logoSpacing) * 2,
        logoY,
        certLogoOptions
      );
      safelyAddImage(
        isoBuffer,
        startX + (logoWidth + logoSpacing) * 3,
        logoY,
        certLogoOptions
      );

      // ============= CONTACT SECTION =============
      // Position contact section at bottom of page
      const footerY = doc.page.height - doc.page.margins.bottom - 50;
      doc.y = footerY;

      // Add a separator line
      doc
        .strokeColor("#888888")
        .lineWidth(0.5)
        .moveTo(doc.page.margins.left, footerY - 5)
        .lineTo(doc.page.margins.left + pageWidth, footerY - 5)
        .stroke();

      // Style contact information with icons (using text approximations)
      doc.font("Helvetica").fontSize(9).fillColor("#000000");
      // Format contact data with icon prefixes
      const contactInfo = [
        {
          icon: addressIconBuffer,
          text: "GMS Road Dehradun, Uttarakhand, India",
        },
        { icon: emailIconBuffer, text: "internship@novanectar.co.in" },
        { icon: websiteIconBuffer, text: "www.novanectar.co.in" },
        { icon: phoneIconBuffer, text: "8979891703 / 8979891705" },
      ];

      // Two-column layout for contact information
      const colWidth = pageWidth / 2;
      const col1X = doc.page.margins.left;
      const col2X = doc.page.margins.left + colWidth;
      const iconSize = 12;
      const iconTextGap = 5;

      // First column
      safelyAddImage(contactInfo[0].icon, col1X, footerY + 5, {
        width: iconSize,
        height: iconSize,
      });
      doc.text(
        contactInfo[0].text,
        col1X + iconSize + iconTextGap,
        footerY + 5
      );

      safelyAddImage(contactInfo[1].icon, col1X, footerY + 20, {
        width: iconSize,
        height: iconSize,
      });
      doc.text(
        contactInfo[1].text,
        col1X + iconSize + iconTextGap,
        footerY + 20
      );

      // Second column
      safelyAddImage(contactInfo[2].icon, col2X, footerY + 5, {
        width: iconSize,
        height: iconSize,
      });
      doc.text(
        contactInfo[2].text,
        col2X + iconSize + iconTextGap,
        footerY + 5
      );

      safelyAddImage(contactInfo[3].icon, col2X, footerY + 20, {
        width: iconSize,
        height: iconSize,
      });
      doc.text(
        contactInfo[3].text,
        col2X + iconSize + iconTextGap,
        footerY + 20
      );
      doc.end();
    } catch (error) {
      console.error("Error in PDF generation:", error);
      reject(error);
    }
  });
}

export { generateEnrollmentPDF };
