import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const sendEmail = async (to, messageContent) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // message content
    const message = {
      from: "rocks.amit19@gmail.com",
      to: to,
      subject: "New Message from Nodemailer App",
      html: `<h3>You have received a new message from Nodemailer App</h3>
        <p>${messageContent}</p>`,
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log(`Message sent to ${info.messageId}`);
  } catch (err) {
    console.log(`Error sending message: ${err.message}`);
    throw err; // Rethrow the error to the caller
  }
};

export default sendEmail;
