import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
  }
});

export async function sendPasswordResetEmail(to, resetLink) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "snackreach1@gmail.com",
    to,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 60 minutes.</p>
    `
  });
}