import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

// Create transporter
const transporter = nodemailer.createTransport(config.smtp);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Send email
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || '🏪 taphoanhadev.com'}" <${config.emailFrom}>`,
      to,
      subject,
      text,
      html,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Chào mừng đến với 🏪 taphoanhadev.com!',
    html: `
      <h1>Xin chào ${name}! 🏪</h1>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại taphoanhadev.com. Chúng tôi rất vui mừng được phục vụ bạn!</p>
      <p>Bắt đầu mua sắm ngay và khám phá những sản phẩm tuyệt vời!</p>
    `,
    text: `Xin chào ${name}! Cảm ơn bạn đã đăng ký tại taphoanhadev.com.`,
  }),
  
  emailVerification: (name, verificationLink) => ({
    subject: 'Verify Your Email Address',
    html: `
      <h1>Hi ${name}</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
    text: `Hi ${name}, Please verify your email: ${verificationLink}`,
  }),
  
  passwordReset: (name, resetLink) => ({
    subject: 'Reset Your Password',
    html: `
      <h1>Hi ${name}</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `Hi ${name}, Reset your password: ${resetLink}`,
  }),
  
  orderConfirmation: (name, orderNumber, orderTotal, orderItems) => ({
    subject: `Order Confirmation - #${orderNumber}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for your order. Your order number is <strong>#${orderNumber}</strong></p>
      <h2>Order Summary</h2>
      <ul>
        ${orderItems.map(item => `<li>${item.quantity}x ${item.productName} - $${item.total}</li>`).join('')}
      </ul>
      <p><strong>Total: $${orderTotal}</strong></p>
      <p>We'll send you another email when your order ships.</p>
    `,
    text: `Order #${orderNumber} confirmed. Total: $${orderTotal}`,
  }),
  
  orderShipped: (name, orderNumber, trackingNumber) => ({
    subject: `Your Order Has Shipped - #${orderNumber}`,
    html: `
      <h1>Your Order Has Shipped!</h1>
      <p>Hi ${name},</p>
      <p>Your order <strong>#${orderNumber}</strong> has been shipped.</p>
      ${trackingNumber ? `<p>Tracking Number: <strong>${trackingNumber}</strong></p>` : ''}
      <p>You should receive it within 3-5 business days.</p>
    `,
    text: `Order #${orderNumber} shipped. ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
  }),
};
