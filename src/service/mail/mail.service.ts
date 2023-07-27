import nodemailer from 'nodemailer';
import env from 'dotenv';
env.config();
const mailConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }

  const mailService = {
    async sendMail (emailTo, subject, text) {
      console.log(mailConfig);
      const transporter = nodemailer.createTransport(mailConfig);
  
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: emailTo,
        subject,
        text
      }, (err, info) => {
        if (err) {
          console.log(err);
          throw new Error('Error');
        } else {
          console.log(info);
        }
      }
      );
    }
  }

export default mailService;