// utils/emailService.js

import { Resend } from "resend";

/**
 * Sends the OTP code to the specified email address using the configured SMTP transporter.
 * @param {string} email - The recipient's email address
 * @returns {Promise<boolean>} - True if email sending succeeded, false otherwise.
 */
export async function sendMail(email, orderId) {
    try {

        console.log(`Attempting to send order confirmation email to ${email} with orderId ${orderId}`);

        const resend = new Resend(process.env.Resent_API);

        const info = await resend.emails.send({
            from: 'no-reply@quick-skip.com',
            to: email,
            subject: 'Your Order Confirmation',
            html: `
                <p>Your order has been confirmed. Order ID: ${orderId}</p>
                <p>Thank you for your purchase.</p>
            `
        });

        // Log the message ID to find the email in your Mailtrap inbox
        console.log(`Email sent to ${email}. Message ID: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error('Email sending failed (Mailtrap/Nodemailer Error):', error);
        // In a production environment, you might log a service failure to a monitoring tool.
        return false;
    }
}