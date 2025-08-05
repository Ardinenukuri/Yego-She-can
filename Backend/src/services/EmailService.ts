import nodemailer from 'nodemailer';
import 'dotenv/config'; 


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: (process.env.EMAIL_PORT === '465'), 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});



const sendCertificateNotification = async (
  recipientEmail: string,
  learnerFullName: string,
  courseName: string
) => {
  const certificatesUrl = `${process.env.FRONTEND_URL}/user-dashboard/components/${encodeURIComponent(learnerFullName)}?courseName=${encodeURIComponent(courseName)}`;

  const subject = `Congratulations! You've Earned a New Certificate!`;
  

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #8a2be2;">Congratulations, ${learnerFullName}!</h1>
      <p>We are thrilled to announce that you have successfully completed the requirements and earned your certificate for the course:</p>
      <p style="font-size: 1.2em; font-weight: bold; color: #555;">${courseName}</p>
      <p>This is a significant achievement, and it reflects your dedication and hard work. We are incredibly proud of you!</p>
      
      <a href="${certificatesUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 1em; color: #fff; background-color: #8a2be2; text-decoration: none; border-radius: 5px;">
        View Your Certificate
      </a>
      
      <p>Don't forget to share your accomplishment with your network on LinkedIn, social media, or with potential employers. You've earned it!</p>
      
      <p>Keep up the amazing work, and we look forward to seeing what you achieve next.</p>
      <br>
      <p>Warmly,</p>
      <p><strong>The Yego SheCan Team</strong></p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: recipientEmail,
    subject: subject,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Certificate notification sent successfully to ${recipientEmail}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send certificate notification to ${recipientEmail}:`, error);
  }
};


export const EmailService = {
  sendCertificateNotification,
};