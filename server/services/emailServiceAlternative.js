const nodemailer = require('nodemailer');

// Alternative email configuration using a more reliable service
// You can use services like SendGrid, Mailgun, or even Gmail with different settings

// Option 1: Using Ethereal Email (for testing - no setup required)
const createTestTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test123'
    }
  });
};

// Option 2: Using Gmail with different approach
const createGmailTransporter = () => {
  const GMAIL_USER = '22-03351@g.batstate-u.edu.ph';
  const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'your-app-password';
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: GMAIL_USER,
      pass: APP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

// Option 3: Using Outlook/Hotmail (often more reliable)
const createOutlookTransporter = () => {
  const OUTLOOK_USER = process.env.OUTLOOK_USER || 'your-outlook-email@outlook.com';
  const OUTLOOK_PASSWORD = process.env.OUTLOOK_PASSWORD || 'your-outlook-password';
  
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: OUTLOOK_USER,
      pass: OUTLOOK_PASSWORD,
    },
  });
};

// Create transporter with fallback options
async function createTransporter() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  
  try {
    console.log(`[DEBUG] Creating transporter with ${emailProvider}...`);
    
    let transporter;
    switch (emailProvider.toLowerCase()) {
      case 'outlook':
        transporter = createOutlookTransporter();
        break;
      case 'test':
        transporter = createTestTransporter();
        break;
      case 'gmail':
      default:
        transporter = createGmailTransporter();
        break;
    }
    
    // Test the connection
    await transporter.verify();
    console.log(`[DEBUG] ${emailProvider} transporter verified successfully`);
    return transporter;
    
  } catch (error) {
    console.error(`[DEBUG] ${emailProvider} transporter failed:`, error.message);
    
    // Fallback to test transporter if all else fails
    if (emailProvider !== 'test') {
      console.log('[DEBUG] Falling back to test transporter...');
      return createTestTransporter();
    }
    
    throw error;
  }
}

// Email templates (same as before)
const emailTemplates = {
  // Contact form email template
  contactForm: (data) => ({
    subject: `New Contact Form Submission - ${data.subject || 'General Inquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
        </div>
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 12px;">
          <p>This email was sent from the RESET Corp. website contact form.</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  }),

  // Order confirmation email template
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmation - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Order Confirmation</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order! We have received your order and it is being processed.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
          <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">${order.status}</span></p>
        </div>

        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Order Items</h3>
          ${order.items.map(item => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: $${item.price}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 12px;">
          <p>If you have any questions about your order, please contact us at info@resetcorp.com</p>
          <p>Order submitted on: ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>
    `
  })
};

// Email service functions
const emailService = {
  // Send contact form email
  sendContactEmail: async (contactData) => {
    try {
      const { subject, html } = emailTemplates.contactForm(contactData);
      const mailOptions = {
        from: process.env.EMAIL_FROM || '22-03351@g.batstate-u.edu.ph',
        to: ['info@resetcorp.com'],
        subject: subject,
        html: html
      };
      console.log('[DEBUG] Sending contact email with options:', mailOptions);
      const transporter = await createTransporter();
      const result = await transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('[DEBUG] Error sending contact email:', error);
      throw new Error('Failed to send contact email');
    }
  },

  // Send order confirmation email
  sendOrderConfirmation: async (order, user) => {
    try {
      const { subject, html } = emailTemplates.orderConfirmation(order, user);
      const mailOptions = {
        from: process.env.EMAIL_FROM || '22-03351@g.batstate-u.edu.ph',
        to: user.email,
        subject: subject,
        html: html
      };
      console.log('[DEBUG] Sending order confirmation email with options:', mailOptions);
      const transporter = await createTransporter();
      const result = await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('[DEBUG] Error sending order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }
};

module.exports = emailService; 