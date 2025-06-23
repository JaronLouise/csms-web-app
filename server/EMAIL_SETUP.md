# Email Setup Guide

This guide will help you configure the email functionality for the RESET Corp. web application.

## Prerequisites

1. A Gmail account (or other email service)
2. App password for your email account

## Configuration

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/resetcorp

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Alternative Email Services

If you prefer to use a different email service, update the transporter configuration in `server/services/emailService.js`:

```javascript
// For Outlook/Hotmail
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// For custom SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Email Features

The application includes the following email functionality:

### 1. Contact Form Emails
- **Endpoint**: `POST /api/emails/contact`
- **Recipients**: info@resetcorp.com
- **Triggered**: When users submit the contact form

### 2. Quote Request Emails
- **Endpoint**: `POST /api/emails/quote`
- **Recipients**: info@resetcorp.com
- **Triggered**: When users submit quote requests

### 3. Order Confirmation Emails
- **Endpoint**: Automatically triggered
- **Recipients**: Customer's email address
- **Triggered**: When orders are created

### 4. Order Status Update Emails
- **Endpoint**: Automatically triggered
- **Recipients**: Customer's email address
- **Triggered**: When order status changes

## Testing

To test the email functionality:

1. Start the server: `npm run dev`
2. Submit a contact form or quote request from the frontend
3. Check your email inbox for the received emails
4. Check the server console for email sending logs

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure you're using an app password, not your regular password
   - Verify 2-factor authentication is enabled

2. **Connection Timeout**
   - Check your internet connection
   - Verify the email service is accessible

3. **Emails Not Sending**
   - Check server console for error messages
   - Verify environment variables are set correctly
   - Ensure the email service is properly configured

### Debug Mode

To enable detailed email logging, add this to your `.env` file:

```env
EMAIL_DEBUG=true
```

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of regular passwords
- Regularly rotate your email credentials
- Consider using environment-specific email configurations

## Production Deployment

For production deployment:

1. Use a dedicated email service (SendGrid, Mailgun, etc.)
2. Set up proper SPF and DKIM records
3. Configure email templates for your brand
4. Set up email monitoring and logging
5. Use environment-specific configurations 