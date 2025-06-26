const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error('=== ERROR HANDLER ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('IP:', req.ip);
  console.error('User Agent:', req.get('User-Agent'));

  // Determine status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 400;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
  }

  // Prepare error response
  const errorResponse = {
    message: process.env.NODE_ENV === 'production' 
      ? getGenericErrorMessage(statusCode)
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  // Add validation errors if present
  if (err.name === 'ValidationError' && err.errors) {
    errorResponse.errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  res.status(statusCode).json(errorResponse);
};

// Get generic error messages for production
const getGenericErrorMessage = (statusCode) => {
  const messages = {
    400: 'Bad request - please check your input',
    401: 'Unauthorized - please log in',
    403: 'Forbidden - you do not have permission',
    404: 'Resource not found',
    409: 'Conflict - resource already exists',
    422: 'Unprocessable entity - validation failed',
    429: 'Too many requests - please try again later',
    500: 'Internal server error - please try again later',
    503: 'Service unavailable - please try again later'
  };
  
  return messages[statusCode] || 'An error occurred';
};

module.exports = { errorHandler };
