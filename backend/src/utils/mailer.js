import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "snackreach1@gmail.com",
    pass: process.env.GMAIL_PASS
  }
});

export async function sendMail(to, subject, html) {
  try {
    const from = process.env.GMAIL_USER || "snackreach1@gmail.com";
    
    if (!process.env.GMAIL_PASS) {
      console.error("❌ GMAIL_PASS not configured");
      throw new Error("Email service not configured");
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent successfully to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
}
