class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);

    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}

module.exports = AppError;
