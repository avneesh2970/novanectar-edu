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

      // Create PDF document with better margins
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
        // Add company logo using buffer with better positioning
        if (logoBuffer) {
          doc.image(logoBuffer, 50, 45, {
            width: 140,
            fit: [140, 70],
            align: 'left',
            valign: 'center',
            fallback: () => {
              doc.fontSize(14).text("Novanectar", 50, 45);
            },
          });
        } else {
          doc.fontSize(14).text("Novanectar", 50, 45);
        }

        // Add geometric pattern background with better opacity
        doc
          .save()
          .fillColor("#f0f6ff")
          .opacity(0.08)
          .translate(0, 0)
          .scale(1)
          .restore();

        // Header with better spacing
        doc
          .moveDown(4)
          .font("Helvetica-Bold")
          .fontSize(18)
          .fillColor("#000")
          .text("ENROLLMENT CONFIRMATION", { align: "center" });

        // ID and Date with better formatting
        doc
          .moveDown()
          .fontSize(11)
          .font("Helvetica")
          .text(`ID - ${orderData?.courseId}`, { align: "left" })
          .text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });

        // Main content with improved spacing and font
        doc
          .moveDown()
          .fontSize(11)
          .font("Helvetica")
          .text(`Dear ${userData?.firstName || "sir"},`, { align: "left" })
          .moveDown()
          .text(
            `Congratulations! We are pleased to offer you online ${
              orderData?.orderType
            }, for the role of ${
              orderData.courseName
            }. The date of commencement of your internship is ${new Date().toLocaleDateString()}`,
            { align: "left", lineGap: 2 }
          )
          .moveDown()
          .text(
            `As an enrolle, you will get the opportunity to gain valuable and hands-on experience. Please note that as a temporary employee, you will not be eligible for the benefits that our regular employees receive. We expect you to comply with our company policies and practices including those related to code of conduct, safety and confidentiality`,
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

        // Footer with signature and improved spacing
        doc.moveDown(2)
          .text("Regards,", { align: "left" })
          .moveDown();

        // Add signature image with better positioning
        if (signatureBuffer) {
          doc.image(signatureBuffer, 50, doc.y, {
            width: 90,
            height: 45,
            fit: [90, 45],
            align: 'left',
            valign: 'center',
            fallback: () => {
              doc.fontSize(10).text("[Signature]", 50, doc.y);
            },
          });
        }

        // Name and designation with better spacing
        doc
          .moveDown(2)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text("Shivam Rai,", { align: "left" })
          .font("Helvetica")
          .text("CEO", { align: "left" });

        // Add stamp with better positioning
        if (stampBuffer) {
          doc.image(stampBuffer, 450, doc.y - 80, {
            width: 70,
            height: 70,
            fit: [70, 70],
            align: 'right',
            valign: 'center',
            fallback: () => {
              doc.fontSize(10).text("[Company Stamp]", 450, doc.y - 80);
            },
          });
        }

        // Add certification logos with improved layout
        doc.moveDown(4);

        // Calculate center position for logos with better spacing
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const logoWidth = 85;
        const logoHeight = 45;
        const logoSpacing = 25;
        const totalLogosWidth = (logoWidth * 4) + (logoSpacing * 3);
        const startX = doc.page.margins.left + (pageWidth - totalLogosWidth) / 2;
        const logoY = doc.y;

        // Add certification logos with controlled dimensions
        const logoOptions = {
          fit: [logoWidth, logoHeight],
          align: 'center',
          valign: 'center'
        };

        if (startupBuffer) {
          doc.image(startupBuffer, startX, logoY, { ...logoOptions });
        }
        if (msmeBuffer) {
          doc.image(msmeBuffer, startX + logoWidth + logoSpacing, logoY, { ...logoOptions });
        }
        if (governmentBuffer) {
          doc.image(governmentBuffer, startX + (logoWidth + logoSpacing) * 2, logoY, { ...logoOptions });
        }
        if (isoBuffer) {
          doc.image(isoBuffer, startX + (logoWidth + logoSpacing) * 3, logoY, { ...logoOptions });
        }

        // Move down for contact section
        doc.moveDown(3);

        // Add contact information with improved styling
        const contactY = doc.y;
        const contactWidth = pageWidth;
        const contactX = doc.page.margins.left;
        const contactPadding = 15;

        // Draw light blue background with rounded corners
        doc
          .save()
          .fillColor('#f0f6ff')
          .roundedRect(contactX, contactY, contactWidth, 100, 5)
          .fill()
          .restore();

        // Add contact information with better formatting
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor('#000');

        // Contact details with bullet points
        const bulletPoint = '•';
        const textX = contactX + 25;
        const lineHeight = 20;

        [
          ['GMS Road Dehradun, Uttarakhand, India'],
          ['Info@novanectar.co.in'],
          ['www.novanectar.co.in'],
          ['8979891703 / 8979891705']
        ].forEach((item, index) => {
          doc
            .text(bulletPoint, contactX + 10, contactY + contactPadding + (index * lineHeight))
            .text(item[0], textX, contactY + contactPadding + (index * lineHeight));
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