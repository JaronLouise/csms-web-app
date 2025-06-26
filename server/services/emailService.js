const nodemailer = require('nodemailer');

// Brevo (Sendinblue) SMTP transporter
const createBrevoTransporter = () => {
  const BREVO_USER = process.env.BREVO_USER;
  const BREVO_PASSWORD = process.env.BREVO_PASSWORD;

  if (!BREVO_USER || !BREVO_PASSWORD) {
    throw new Error('Brevo email credentials not configured');
  }

  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: BREVO_USER,
      pass: BREVO_PASSWORD,
    },
  });
};

// Create transporter (only Brevo supported)
async function createTransporter() {
  try {
    const transporter = createBrevoTransporter();
    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error('[DEBUG] Brevo transporter failed:', error.message);
    throw error;
  }
}

// Email templates
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

  // Quote request email template
  quoteRequest: (data) => ({
    subject: `New Quote Request - ${data.serviceType || 'Service Inquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Quote Request</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db; margin-top: 0;">Client Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        </div>
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Project Details</h3>
          <p><strong>Service Type:</strong> ${data.serviceType}</p>
          <p><strong>Budget Range:</strong> ${data.budgetRange || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
          <p><strong>Project Description:</strong></p>
          <p style="white-space: pre-wrap;">${data.projectDescription}</p>
          ${data.additionalInfo ? `<p><strong>Additional Information:</strong></p><p style="white-space: pre-wrap;">${data.additionalInfo}</p>` : ''}
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 12px;">
          <p>This quote request was submitted from the RESET Corp. website.</p>
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
          <p><strong>Total Amount:</strong> ₱${order.totalAmount.toLocaleString()}</p>
          <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">${order.status}</span></p>
        </div>

        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Order Items</h3>
          ${order.items.map(item => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: ₱${item.price.toLocaleString()}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 12px;">
          <p>If you have any questions about your order, please contact us at info@resetcorp.com</p>
          <p>Order submitted on: ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>
    `
  }),

  // Order status update email template
  orderStatusUpdate: (order, user, previousStatus) => ({
    subject: `Order Status Update - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Order Status Update</h2>
        <p>Dear ${user.name},</p>
        <p>Your order status has been updated.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db; margin-top: 0;">Order Information</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Previous Status:</strong> ${previousStatus}</p>
          <p><strong>New Status:</strong> <span style="color: #27ae60; font-weight: bold;">${order.status}</span></p>
          <p><strong>Updated On:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">What This Means</h3>
          ${getStatusDescription(order.status)}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 12px;">
          <p>If you have any questions about your order, please contact us at info@resetcorp.com</p>
        </div>
      </div>
    `
  })
};

// Helper function to get status descriptions
const getStatusDescription = (status) => {
  const descriptions = {
    'pending': '<p>Your order is being reviewed and will be processed soon.</p>',
    'processing': '<p>Your order is currently being processed and prepared for shipment.</p>',
    'shipped': '<p>Your order has been shipped and is on its way to you.</p>',
    'delivered': '<p>Your order has been successfully delivered.</p>',
    'cancelled': '<p>Your order has been cancelled. Please contact us if you have any questions.</p>'
  };
  return descriptions[status] || '<p>Your order status has been updated.</p>';
};

// Email service functions
const emailService = {
  // Send contact form email
  sendContactEmail: async (contactData) => {
    try {
      const { subject, html } = emailTemplates.contactForm(contactData);
      const fromEmail = process.env.EMAIL_FROM || 'noreply@resetcorp.com';
      const mailOptions = {
        from: fromEmail,
        to: [process.env.ADMIN_EMAIL || 'admin@resetcorp.com'],
        subject: subject,
        html: html
      };
      const transporter = await createTransporter();
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send contact email');
    }
  },

  // Send quote request email
  sendQuoteEmail: async (quoteData) => {
    try {
      const { subject, html } = emailTemplates.quoteRequest(quoteData);
      const fromEmail = process.env.EMAIL_FROM || 'noreply@resetcorp.com';
      const mailOptions = {
        from: fromEmail,
        to: [process.env.ADMIN_EMAIL || 'admin@resetcorp.com'],
        subject: subject,
        html: html
      };
      const transporter = await createTransporter();
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send quote email');
    }
  },

  // Send order confirmation email
  sendOrderConfirmation: async (order, user) => {
    try {
      const { subject, html } = emailTemplates.orderConfirmation(order, user);
      const fromEmail = process.env.EMAIL_FROM || 'noreply@resetcorp.com';
      const mailOptions = {
        from: fromEmail,
        to: user.email,
        subject: subject,
        html: html
      };
      const transporter = await createTransporter();
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send order confirmation email');
    }
  },

  // Send order status update email
  sendOrderStatusUpdate: async (order, user, previousStatus) => {
    try {
      const { subject, html } = emailTemplates.orderStatusUpdate(order, user, previousStatus);
      const fromEmail = process.env.EMAIL_FROM || 'noreply@resetcorp.com';
      const mailOptions = {
        from: fromEmail,
        to: user.email,
        subject: subject,
        html: html
      };
      const transporter = await createTransporter();
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send order status update email');
    }
  }
};

module.exports = emailService; 