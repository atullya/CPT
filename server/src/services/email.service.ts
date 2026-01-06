import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ENV } from '../config/env';
import { logger } from '../config/logger';

if (
  !ENV.SES_REGION ||
  !ENV.SES_ACCESS_KEY_ID ||
  !ENV.SES_SECRET_ACCESS_KEY ||
  !ENV.SENDER_EMAIL_ADDRESS
) {
  throw new Error('Missing required SES environment variables');
}

const sesClient = new SESClient({
  region: ENV.SES_REGION,
  credentials: {
    accessKeyId: ENV.SES_ACCESS_KEY_ID,
    secretAccessKey: ENV.SES_SECRET_ACCESS_KEY,
  },
});

export class EmailService {
  static async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
        Source: ENV.SENDER_EMAIL_ADDRESS,
      });

      const result = await sesClient.send(command);

      logger.info(`SES email sent successfully`, {
        messageId: result.MessageId,
        to,
      });

      return result;
    } catch (error) {
      logger.error('SES email send failed', error);
      throw error;
    }
  }

  static async sendPasswordResetEmail(to: string, resetUrl: string) {
    const subject = 'Password Reset Request';
    const { passwordResetTemplate } = await import('../utils/emailHelper');

    const html = passwordResetTemplate(resetUrl);

    return this.sendEmail({ to, subject, html });
  }
}
