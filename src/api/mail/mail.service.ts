import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { generateEmailVerificationLinkTemplate, generateOtpTemplate } from 'src/utils/helper.utils';
@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('email_host'),
      port: this.config.get<number>('email_port'),
      secure: this.config.get<boolean>('email_secured'),
      auth: {
        user: this.config.get<string>('email_user'),
        pass: this.config.get<string>('email_password'),
      },
    });

    return transporter;
  }

  async sendOtp(email: string, otp: string): Promise<any> {
    try {
      const send = this.mailTransport();
      const html = generateOtpTemplate(otp);
      const options: Mail.Options = {
        from: {
          name: this.config.get<string>('app_name'),
          address: this.config.get<string>('email_from'),
        },
        to: email,
        subject: 'Email verification',
        html,
      };
      const result = await send.sendMail(options);
      return result;
    } catch (error) {
      console.log('error', error);
    }
  }

  async loginOtp(email: string, otp: string): Promise<any> {
    try {
      const send = this.mailTransport();
      const html = generateOtpTemplate(otp);
      const options: Mail.Options = {
        from: {
          name: this.config.get<string>('app_name'),
          address: this.config.get<string>('email_from'),
        },
        to: email,
        subject: 'Login verification',
        html,
      };
      const result = await send.sendMail(options);
      return result;
    } catch (error) {
      console.log('error', error);
    }
  }

  async sendEmailVerificationLink(email: string, token: string): Promise<any> {
    try {
      const send = this.mailTransport();
      // const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;
      const verificationLink = `http://localhost:5000/api/v1/auth/verify-email/${token}`;
      const html = generateEmailVerificationLinkTemplate(verificationLink);
      const options: Mail.Options = {
        from: {
          name: this.config.get<string>('app_name'),
          address: this.config.get<string>('email_from'),
        },
        to: email,
        subject: 'Email verification',
        html,
      };
      const result = await send.sendMail(options);
      return result;
    } catch (error) {
      console.log('error', error);
    }
  }
}
