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
      // Fetch all images first
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
      });

      // Collect PDF chunks
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      try {
        // Add company logo using buffer
        if (logoBuffer) {
          doc.image(logoBuffer, 50, 45, {
            width: 150,
            fallback: () => {
              doc.fontSize(12).text("Novanectar", 50, 45);
            },
          });
        } else {
          doc.fontSize(12).text("Novanectar", 50, 45);
        }

        // Add geometric pattern background
        doc
          .save()
          .fillColor("#f0f6ff")
          .opacity(0.1)
          .translate(0, 0)
          .scale(1)
          .restore();

        // Header
        doc
          .moveDown(4)
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor("#000")
          .text("ENROLLMENT CONFIRMATION", { align: "center" });

        // ID and Date
        doc
          .moveDown()
          .fontSize(12)
          .text(`ID - ${orderData?.courseId}`, { align: "left" })
          .text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });

        // Main content
        doc
          .moveDown()
          .fontSize(12)
          .text(`Dear ${userData?.firstName || "sir"},`, { align: "left" })
          .moveDown()
          .text(
            `Congratulations! We are pleased to offer you online ${
              orderData?.orderType
            }, for the role of ${
              orderData.courseName
            }. The date of commencement of your internship is ${new Date().toLocaleDateString()}`,
            { align: "left" }
          )
          .moveDown()
          .text(
            `As an enrolle, you will get the opportunity to gain valuable and hands-on experience. Please note that as a temporary employee, you will not be eligible for the benefits that our regular employees receive. We expect you to comply with our company policies and practices including those related to code of conduct, safety and confidentiality`,
            { align: "left" }
          )
          .moveDown()
          .text(
            `As we welcome you onboard, we assure you that your internship with Novanectar Services Private Limited will be rewarding and fruitful. Wishing you all the very best.`,
            {
              align: "left",
              width: 500,
            }
          );

        // Footer with signature
        doc.moveDown(2).text("Regards,", { align: "left" }).moveDown();

        // Add signature image
        if (signatureBuffer) {
          doc.image(signatureBuffer, 50, doc.y, {
            width: 100,
            fallback: () => {
              doc.fontSize(10).text("[Signature]", 50, doc.y);
            },
          });
        }

        doc
          .moveDown(2)
          .text("Shivam Rai,", { align: "left" })
          .text("CEO", { align: "left" });

        // Add stamp at the bottom right
        if (stampBuffer) {
          doc.image(stampBuffer, 450, doc.y - 80, {
            width: 80,
            fallback: () => {
              doc.fontSize(10).text("[Company Stamp]", 450, doc.y - 80);
            },
          });
        }

        // Add certification logos
        doc.moveDown(4);

        // Calculate center position for logos
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const logoWidth = 80; // Uniform size for all logos
        const logoSpacing = 20;
        const totalLogosWidth = (logoWidth * 4) + (logoSpacing * 3);
        const startX = doc.page.margins.left + (pageWidth - totalLogosWidth) / 2;
        const logoY = doc.y;

        // Add certification logos in a centered row with uniform size
        if (startupBuffer) {
          doc.image(startupBuffer, startX, logoY, { 
            width: logoWidth,
            height: logoWidth // Make it square
          });
        }
        if (msmeBuffer) {
          doc.image(msmeBuffer, startX + logoWidth + logoSpacing, logoY, {
            width: logoWidth,
            height: logoWidth
          });
        }
        if (governmentBuffer) {
          doc.image(governmentBuffer, startX + (logoWidth + logoSpacing) * 2, logoY, {
            width: logoWidth,
            height: logoWidth
          });
        }
        if (isoBuffer) {
          doc.image(isoBuffer, startX + (logoWidth + logoSpacing) * 3, logoY, {
            width: logoWidth,
            height: logoWidth
          });
        }

        // Move down after logos
        doc.moveDown(4);

        // Add contact information with styled background and icons
        const contactY = doc.y;
        const contactWidth = 500;
        const contactX = doc.page.margins.left;

        // Draw light blue background
        doc
          .save()
          .fillColor('#f0f6ff')
          .rect(contactX, contactY, contactWidth, 100)
          .fill()
          .restore();

        // Add contact information with icons
        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#000');

        // Location
        doc.text('🏢', contactX + 15, contactY + 15);
        doc.text('GMS Road Dehradun, Uttarakhand, India', contactX + 40, contactY + 15);

        // Email
        doc.text('✉️', contactX + 15, contactY + 35);
        doc.text('Info@novanectar.co.in', contactX + 40, contactY + 35);

        // Website
        doc.text('🌐', contactX + 15, contactY + 55);
        doc.text('www.novanectar.co.in', contactX + 40, contactY + 55);

        // Phone
        doc.text('📞', contactX + 15, contactY + 75);
        doc.text('8979891703 / 8979891705', contactX + 40, contactY + 75);

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