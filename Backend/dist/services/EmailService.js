"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: (process.env.EMAIL_PORT === '465'),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendCertificateNotification = (recipientEmail, learnerFullName, courseName) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield transporter.sendMail(mailOptions);
        console.log(`[Email Service] Certificate notification sent successfully to ${recipientEmail}`);
    }
    catch (error) {
        console.error(`[Email Service] Failed to send certificate notification to ${recipientEmail}:`, error);
    }
});
exports.EmailService = {
    sendCertificateNotification,
};
