import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "snackreach_secret_key_2024";

router.post("/forgot-password", async (req, res) => {
  console.log("POST /forgot-password - Request received");
  try {
    const { email } = req.body;
    
    if (!email) {
      console.log("POST /forgot-password - Email missing");
      return res.status(400).json({ error: "Email is required" });
    }

    console.log(`POST /forgot-password - Processing email: ${email}`);

    // Always respond the same (security)
    const genericMsg = { message: "If an account exists, a reset link was sent." };

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      console.log(`POST /forgot-password - User not found for email: ${email}`);
      return res.json(genericMsg);
    }

    console.log(`POST /forgot-password - User found: ${user.id}`);

    // Generate JWT token valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: "password-reset" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store hashed token in database
    const crypto = await import("crypto");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: { userId: user.id, tokenHash, expiresAt }
    });

    console.log(`POST /forgot-password - Token created for user: ${user.id}`);

    // Get frontend domain from environment variable
    const frontendDomain = process.env.FRONTEND_DOMAIN || process.env.VITE_FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendDomain}/reset-password?token=${token}&email=${email}`;

    console.log(`POST /forgot-password - Reset link: ${resetLink}`);

    try {
      await sendPasswordResetEmail(email, resetLink);
      console.log(`POST /forgot-password - Email sent successfully to: ${email}`);
    } catch (emailError) {
      console.error("POST /forgot-password - Failed to send email:", emailError);
      // Don't fail the request if email fails - token is still created
    }

    console.log(`POST /forgot-password - Success response sent`);
    res.json(genericMsg);
  } catch (error) {
    console.error("POST /forgot-password - Error:", error);
    // Still return generic message for security
    res.json({ message: "If an account exists, a reset link was sent." });
  }
});

router.post("/reset-password", async (req, res) => {
  console.log("POST /reset-password - Request received");
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      console.log("POST /reset-password - Missing required fields");
      return res.status(400).json({ error: "Email, token, and password are required" });
    }

    if (password.length < 8) {
      console.log("POST /reset-password - Password too short");
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    console.log(`POST /reset-password - Verifying token for email: ${email}`);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.type !== "password-reset" || decoded.email !== email) {
        console.log("POST /reset-password - Invalid token type or email mismatch");
        return res.status(400).json({ error: "Invalid or expired link" });
      }
    } catch (jwtError) {
      console.error("POST /reset-password - JWT verification failed:", jwtError.message);
      return res.status(400).json({ error: "Invalid or expired link" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || user.id !== decoded.userId) {
      console.log("POST /reset-password - User not found or ID mismatch");
      return res.status(400).json({ error: "Invalid or expired link" });
    }

    // Verify token exists in database and is not used
    const crypto = await import("crypto");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!record) {
      console.log("POST /reset-password - Token not found in database or expired");
      return res.status(400).json({ error: "Invalid or expired link" });
    }

    console.log(`POST /reset-password - Token verified, resetting password for user: ${user.id}`);

    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPass }
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true }
    });

    console.log(`POST /reset-password - Password reset successfully for user: ${user.id}`);
    res.json({ message: "Password successfully reset." });
  } catch (error) {
    console.error("POST /reset-password - Error:", error);
    res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
});

export default router;
