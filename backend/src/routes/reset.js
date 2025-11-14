import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateResetToken, hashToken } from "../utils/resetToken.js";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Always respond the same (security)
    const genericMsg = { message: "If an account exists, a reset link was sent." };

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.json(genericMsg);

    const { token, tokenHash } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordReset.create({
      data: { userId: user.id, tokenHash, expiresAt }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

    try {
      await sendPasswordResetEmail(email, resetLink);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Don't fail the request if email fails - token is still created
    }

    res.json(genericMsg);
  } catch (error) {
    console.error("Forgot password error:", error);
    // Still return generic message for security
    res.json({ message: "If an account exists, a reset link was sent." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ error: "Email, token, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid or expired link" });

    const tokenHash = hashToken(token);

    const record = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!record) return res.status(400).json({ error: "Invalid or expired link" });

    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPass }
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true }
    });

    res.json({ message: "Password successfully reset." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
});

export default router;
