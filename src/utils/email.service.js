import { Resend } from "resend";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * @description Send a password reset email to the user.
 * @param {string} email - Destination email
 * @param {string} resetUrl - URL including the reset token
 */
export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>You have requested a password reset</h1>
        <p>Please click the link below to reset your password. This link will expire in 30 minutes.</p>
        <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    if (error) {
      logger.error("Resend Email Error:", error);
      throw new Error("Failed to send reset email");
    }

    return data;
  } catch (err) {
    logger.error("Email Service Error:", err);
    throw new Error("Email could not be sent");
  }
};
