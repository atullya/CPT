import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.SES_REGION as string,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY as string,
  },
});

export const sendEmail = async (to: string, subject: string, html: string, text: string) => {
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
        Text: {
          Data: text,
          Charset: 'UTF-8',
        },
      },
    },
    Source: process.env.SENDER_EMAIL_ADDRESS as string,
    ReplyToAddresses: [process.env.REPLY_TO_EMAIL_ADDRESS as string],
  });

  return await sesClient.send(command);
};
