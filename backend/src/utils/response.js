// API Response formatter
export class ApiResponse {
  constructor(statusCode, data = null, message = null, errors = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    
    if (data !== null) {
      this.data = data;
    }
    
    if (errors !== null) {
      this.errors = errors;
    }
    
    this.timestamp = new Date().toISOString();
  }
  
  static success(data, message = 'Success', statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }
  
  static error(message, errors = null, statusCode = 500) {
    return new ApiResponse(statusCode, null, message, errors);
  }
  
  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }
  
  static noContent(message = 'No content') {
    return new ApiResponse(204, null, message);
  }
  
  static badRequest(message = 'Bad request', errors = null) {
    return new ApiResponse(400, null, message, errors);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ApiResponse(401, null, message);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ApiResponse(403, null, message);
  }
  
  static notFound(message = 'Resource not found') {
    return new ApiResponse(404, null, message);
  }
  
  static conflict(message = 'Conflict', errors = null) {
    return new ApiResponse(409, null, message, errors);
  }
  
  static validationError(errors) {
    return new ApiResponse(422, null, 'Validation failed', errors);
  }
}

// Custom Error classes
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = null) {
    super(message, 422);
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}
