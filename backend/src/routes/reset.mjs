import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateResetToken, hashToken } from "../utils/resetToken.mjs";
import { sendPasswordResetEmail } from "../utils/sendEmail.mjs";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same (security)
  const genericMsg = { message: "If an account exists, a reset link was sent." };

  if (!user) return res.json(genericMsg);

  const { token, tokenHash } = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordReset.create({
    data: { userId: user.id, tokenHash, expiresAt }
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

  await sendPasswordResetEmail(email, resetLink);

  res.json(genericMsg);
});

router.post("/reset-password", async (req, res) => {
  const { email, token, password } = req.body;

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
});

export default router;
