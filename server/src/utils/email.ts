import nodemailer from "nodemailer";
import { ENV } from "../config/env";
import { logger } from "../config/logger";


const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: Number(ENV.SMTP_PORT),
  secure: ENV.SMTP_PORT === "465",
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: ENV.SMTP_USER,
      to,
      subject,
      html,
    });

    logger.info("Email sent successfully:", info.messageId);

    if (ENV.SMTP_HOST.includes("ethereal")) {
      logger.info("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};
