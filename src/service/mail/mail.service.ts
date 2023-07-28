import nodemailer from 'nodemailer';
import {mailConfig} from '../../config/mailConfig';
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