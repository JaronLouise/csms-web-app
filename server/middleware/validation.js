const { body, validationResult } = require('express-validator');
const xss = require('xss');

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input.trim());
  }
  return input;
};

// Sanitize request body
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }
  next();
};

// Validation rules for user registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .optional({ checkFalsy: true })
    .isIn(['customer', 'admin'])
    .withMessage('Invalid role specified')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for contact form
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[0-9\s\-\(\)\.]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject must be less than 100 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be between 5 and 2000 characters')
];

// Validation rules for quote request
const validateQuoteRequest = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[0-9\s\-\(\)\.]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
  
  body('serviceType')
    .trim()
    .notEmpty()
    .withMessage('Service type is required'),
  
  body('projectDescription')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Project description must be between 20 and 2000 characters'),
  
  body('budgetRange')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Budget range must be less than 50 characters'),
  
  body('timeline')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Timeline must be less than 100 characters'),
  
  body('additionalInfo')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Additional information must be less than 1000 characters')
];

// Validation rules for product creation/update
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Validation rules for order creation
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('billingAddress.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('billingAddress.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('billingAddress.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('billingAddress.postalCode')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Postal code must be between 3 and 10 characters'),
  
  body('billingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('billingAddress.region')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Region must be between 2 and 50 characters'),
  
  body('billingAddress.phone')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[0-9\s\-\(\)\.]{7,20}$/)
    .withMessage('Please provide a valid phone number')
];

// Check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  sanitizeBody,
  validateRegistration,
  validateLogin,
  validateContactForm,
  validateQuoteRequest,
  validateProduct,
  validateOrder,
  handleValidationErrors
}; 