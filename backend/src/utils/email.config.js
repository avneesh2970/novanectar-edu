import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add DKIM configuration if you have it
    // dkim: {
    //   domainName: "novanectar.co.in",
    //   keySelector: "2023",
    //   privateKey: process.env.DKIM_PRIVATE_KEY
    // },
    // Add custom headers
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "high",
    },
  });
};

const sendEmail = async (to, subject, html, attachments) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: "Novanectar",
      address: "internship.novanectar@gmail.com",
    },
    to,
    subject,
    html,
    attachments,
    headers: {
      "Feedback-ID": "novanectar:transactional:12345",
      "X-Mailer": "Nodemailer",
      Precedence: "bulk",
    },
  };

  return await transporter.sendMail(mailOptions);
};

export { sendEmail };
