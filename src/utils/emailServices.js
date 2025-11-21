// utils/emailService.js

import nodemailer from 'nodemailer';

// --- NODEMAILER TRANSPORTER CONFIGURATION ---
// This object handles the connection details to the SMTP server (Mailtrap)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  // Mailtrap usually does not require a secure (TLS) connection on its default development ports
  secure: process.env.SMTP_PORT == 465, // Only set secure: true if using port 465/587 with SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends the OTP code to the specified email address using the configured SMTP transporter.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The generated OTP code.
 * @returns {Promise<boolean>} - True if email sending succeeded, false otherwise.
 */
export async function sendOTPEmail(email, otp) {
  try {
    const OTP_EXPIRY_MINUTES = 5; // Use the same value as in your generate route

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'no-reply@quick-skip.com',
      to: email,
      subject: 'Your Login Verification Code',
      html: `
        <p>Your one-time login code is:</p>
        <h2 style="color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">${otp}</h2>
        <p>This code is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      `,
      text: `Your one-time login code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log the message ID to find the email in your Mailtrap inbox
    console.log(`Email sent to ${email}. Message ID: ${info.messageId}`); 
    return true;

  } catch (error) {
    console.error('Email sending failed (Mailtrap/Nodemailer Error):', error);
    // In a production environment, you might log a service failure to a monitoring tool.
    return false;
  }
}