const emailService = require('../services/emailService');

// @desc Send contact form email
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Name, email, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim()
    };

    const result = await emailService.sendContactEmail(contactData);
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ 
      message: 'Failed to send contact email. Please try again later.' 
    });
  }
};

// @desc Send quote request email
exports.sendQuoteEmail = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      company, 
      serviceType, 
      projectDescription, 
      budgetRange, 
      timeline, 
      additionalInfo 
    } = req.body;

    // Basic validation
    if (!name || !email || !serviceType || !projectDescription) {
      return res.status(400).json({ 
        message: 'Name, email, service type, and project description are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    const quoteData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      serviceType: serviceType.trim(),
      projectDescription: projectDescription.trim(),
      budgetRange: budgetRange ? budgetRange.trim() : '',
      timeline: timeline ? timeline.trim() : '',
      additionalInfo: additionalInfo ? additionalInfo.trim() : ''
    };

    const result = await emailService.sendQuoteEmail(quoteData);
    
    res.status(200).json({
      success: true,
      message: 'Quote request submitted successfully. Our team will review your project and get back to you within 24-48 hours.',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Quote email error:', error);
    res.status(500).json({ 
      message: 'Failed to send quote request. Please try again later.' 
    });
  }
};

// @desc Send order confirmation email
exports.sendOrderConfirmation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Here you would typically fetch the order from database
    // For now, we'll use a mock order structure
    const order = {
      _id: orderId,
      totalAmount: req.body.totalAmount || 0,
      status: 'pending',
      items: req.body.items || [],
      createdAt: new Date()
    };

    const result = await emailService.sendOrderConfirmation(order, user);
    
    res.status(200).json({
      success: true,
      message: 'Order confirmation email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Order confirmation email error:', error);
    res.status(500).json({ 
      message: 'Failed to send order confirmation email' 
    });
  }
};

// @desc Send order status update email
exports.sendOrderStatusUpdate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus, previousStatus } = req.body;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!newStatus) {
      return res.status(400).json({ message: 'New status is required' });
    }

    // Here you would typically fetch the order from database
    // For now, we'll use a mock order structure
    const order = {
      _id: orderId,
      status: newStatus,
      totalAmount: req.body.totalAmount || 0,
      items: req.body.items || []
    };

    const result = await emailService.sendOrderStatusUpdate(order, user, previousStatus || 'unknown');
    
    res.status(200).json({
      success: true,
      message: 'Order status update email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Order status update email error:', error);
    res.status(500).json({ 
      message: 'Failed to send order status update email' 
    });
  }
}; 