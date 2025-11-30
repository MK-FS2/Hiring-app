import nodemailer from "nodemailer";

async function SendMail(toEmail: string, content: string, ExpireTime:Date):Promise<boolean> 
{

  const transport = nodemailer.createTransport(
{
    service: "gmail",
    auth: {
    user: process.env.EMAILUSER,
      pass: process.env.EMAILPASS,
    },
  });
  const diffInMinutes = Math.ceil((ExpireTime.getTime() - Date.now()) / 60000);
  const mailOptions = {
    from: `"Social App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code",
    html:
     `
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

   const SendResult = await transport.sendMail(mailOptions)
   if(SendResult.rejected.length > 0)
   {
   return false
   }
   else 
   {
   return true
   }
}

export default SendMail;
