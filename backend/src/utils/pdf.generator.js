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
      // Fetch all images including company logo
      const [
        logoBuffer,
        signatureBuffer,
        stampBuffer,
        startupBuffer,
        msmeBuffer,
        governmentBuffer,
        isoBuffer,
      ] = await Promise.all([
        getImageBuffer("https://novanectar.co.in/logo.png"),
        getImageBuffer("https://edu.novanectar.co.in/signature.png"),
        getImageBuffer("https://edu.novanectar.co.in/stamp.png"),
        getImageBuffer("https://edu.novanectar.co.in/startup.png"),
        getImageBuffer("https://edu.novanectar.co.in/msme.png"),
        getImageBuffer("https://edu.novanectar.co.in/government.png"),
        getImageBuffer("https://edu.novanectar.co.in/iso.png"),
      ]);

      // Create PDF document
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: "Enrollment Confirmation",
          Author: "Novanectar Services Private Limited",
        },
      });

      // Collect PDF chunks
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      try {
        // Helper function to safely add images
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

        // Add company logo at top
        if (logoBuffer) {
          safelyAddImage(logoBuffer, 50, 45, {
            width: 80,
            height: 80,
            fallback: "NOVANECTAR",
          });
        }

        // Header
        doc
          .moveDown(4)
          .fontSize(16)
          .text("ENROLLMENT CONFIRMATION", { align: "center" });

        // ID and Date
        doc
          .moveDown()
          .fontSize(11)
          .font("Helvetica")
          .text(`ID - ${orderData?.courseId || "NN/08/0113"}`, { align: "left" })
          .moveDown()
          .text(`Dear ${userData?.firstName || "Aman Singh"},`, { align: "left" });

        // Main content
        doc
          .moveDown()
          .fontSize(11)
          .text(
            `Congratulations! We are pleased to offer you offline internship for 3 months, for the role of Full-Stack Development intern. The date of commencement of your internship is 20th November,2024.`,
            { align: "left", lineGap: 2 }
          )
          .moveDown()
          .text(
            `As an intern, you will get the opportunity to gain valuable and hands-on experience. Please note that as a temporary employee, you will not be eligible for the benefits that our regular employees receive. We expect you to comply with our company policies and practices including those related to code of conduct, safety and confidentiality.`,
            { align: "left", lineGap: 2 }
          )
          .moveDown()
          .text(
            `As we welcome you onboard, we assure you that your internship with Novanectar Services Private Limited will be rewarding and fruitful. Wishing you all the very best.`,
            {
              align: "left",
              width: 500,
              lineGap: 2,
            }
          );

        // Footer with signature
        doc.moveDown(2).text("Regards,", { align: "left" }).moveDown();

        // Calculate positions for signature and stamp
        const signatureY = doc.y;

        // Add signature image
        safelyAddImage(signatureBuffer, 50, signatureY, {
          width: 100,
          height: 40,
          fallback: "[Signature]",
        });

        // Add name and designation
        doc
          .moveDown(2)
          .text("Shivam Rai,", { align: "left" })
          .text("CEO", { align: "left" });

        // Add stamp
        safelyAddImage(stampBuffer, 450, signatureY - 20, {
          width: 80,
          height: 80,
          fallback: "[Company Stamp]",
        });

        // Move down after signature and stamp
        doc.moveDown(8);

        // Add certification logos
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const logoWidth = 100;
        const logoHeight = 50;
        const logoSpacing = 20;
        const totalLogosWidth = logoWidth * 4 + logoSpacing * 3;
        const startX = doc.page.margins.left + (pageWidth - totalLogosWidth) / 2;
        const logoY = doc.y;

        // Add certification logos with uniform size
        const certLogoOptions = {
          width: logoWidth,
          height: logoHeight,
          align: 'center',
          valign: 'center'
        };

        safelyAddImage(startupBuffer, startX, logoY, certLogoOptions);
        safelyAddImage(msmeBuffer, startX + logoWidth + logoSpacing, logoY, certLogoOptions);
        safelyAddImage(governmentBuffer, startX + (logoWidth + logoSpacing) * 2, logoY, certLogoOptions);
        safelyAddImage(isoBuffer, startX + (logoWidth + logoSpacing) * 3, logoY, certLogoOptions);

        // Move down for contact section with increased margin
        doc.moveDown(5);

        // Add contact information with light blue background
        const contactY = doc.y;
        const contactWidth = pageWidth;
        const contactX = doc.page.margins.left;
        const contactPadding = 15;

        // Draw light blue background
        doc
          .save()
          .fillColor("#f0f6ff")
          .rect(contactX, contactY, contactWidth, 100)
          .fill()
          .restore();

        // Add contact information
        doc.font("Helvetica").fontSize(10).fillColor("#000");

        const contactInfo = [
          "GMS Road Dehradun, Uttarakhand, India",
          "Info@novanectar.co.in",
          "www.novanectar.co.in",
          "8979891703 / 8979891705",
        ];

        contactInfo.forEach((info, index) => {
          doc.text(
            info,
            contactX + contactPadding,
            contactY + contactPadding + index * 20
          );
        });

        // End the document
        doc.end();
      } catch (error) {
        console.error("Error generating PDF content:", error);
        doc.end();
        reject(error);
      }
    } catch (error) {
      console.error("Error in PDF generation setup:", error);
      reject(error);
    }
  });
}

export { generateEnrollmentPDF };