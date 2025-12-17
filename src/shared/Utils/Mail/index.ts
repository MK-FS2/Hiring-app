import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class MailService 
{
  private transport;

  constructor(private configService:ConfigService) 
  {
    const emailConfig = this.configService.get<{user:string;pass:string}>("email");
    
    this.transport = nodemailer.createTransport({service:"gmail",auth: {user:emailConfig!.user,pass:emailConfig!.pass}});
  }

  async sendMail(toEmail: string, content: string, expireTime: Date):Promise<boolean> 
  {
    const diffInMinutes=Math.ceil((expireTime.getTime()-Date.now())/60000);

    const emailConfig = this.configService.get<{user:string}>("email");

    const mailOptions = 
    {
      from: `"Social App" <${emailConfig!.user}>`,
      to: toEmail,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px;">Your verification code is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007bff;">${content}</p>
          <p style="font-size: 14px; color: #555;">
            This code will expire in ${diffInMinutes} minutes.
          </p>
        </div>
      `,
    };

    const sendResult = await this.transport.sendMail(mailOptions);
    return sendResult.rejected.length === 0;
  }


  async sendCustomMail(toEmail:string,subject:string,html:string,):Promise<boolean> 
  {
  const emailConfig = this.configService.get<{user:string}>('email');

  const mailOptions = 
  {
    from: `"Social App" <${emailConfig!.user}>`,
    to: toEmail,
    subject,
    html,
  };
  const sendResult = await this.transport.sendMail(mailOptions);
  return sendResult.rejected.length === 0;
}
}
