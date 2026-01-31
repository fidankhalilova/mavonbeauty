const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: `"Mavon Beauty" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Password Reset Request - Mavon Beauty',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ba350;">Password Reset Request</h2>
                <p>You requested to reset your password for your Mavon Beauty account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" 
                style="display: inline-block; padding: 12px 24px; background-color: #0ba350; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Mavon Beauty. All rights reserved.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Send password changed confirmation
const sendPasswordChangedEmail = async (email, name) => {
    const mailOptions = {
        from: `"Mavon Beauty" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Password Changed Successfully - Mavon Beauty',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ba350;">Password Changed Successfully</h2>
                <p>Hello ${name},</p>
                <p>Your password has been changed successfully.</p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Mavon Beauty. All rights reserved.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending password changed email:', error);
        return false;
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendPasswordChangedEmail
};