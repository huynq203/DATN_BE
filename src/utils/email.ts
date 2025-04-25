/* eslint-disable @typescript-eslint/no-require-imports */
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
config()
const verifyEmailTemplates = fs.readFileSync(path.resolve('src/templates/email-verify.html'), 'utf8')

// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress, // Nguồn từ nào gửi
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

export const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

export const sendVerifyRegisterEmail = (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplates
) => {
  return sendVerifyEmail(
    toAddress,
    'Verify your email',
    template
      .replace('{{title}}', 'Vui lòng xác thực Email của bạn')
      .replace('{{content}}', 'Ấn nút bên dưới để xác thực email của bạn')
      .replace('{{titleLink}}', 'Xác thực email')
      .replace('{{link}}', `${process.env.CLIENT_URL}/auth/verify-email?token=${email_verify_token}`)
  )
}

export const sendForgotPasswordEmail = (
  toAddress: string,
  forgot_password_token: string,
  template: string = verifyEmailTemplates
) => {
  return sendVerifyEmail(
    toAddress,
    'Forgot password',
    template
      .replace('{{title}}', 'Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu của mình')
      .replace('{{content}}', 'Nhấp vào nút bên dưới để đặt lại mật khẩu của bạn')
      .replace('{{titleLink}}', 'Đặt lại mật khẩu')
      .replace('{{link}}', `${process.env.CLIENT_URL}/auth/verify-forgot-password?token=${forgot_password_token}`)
  )
}
