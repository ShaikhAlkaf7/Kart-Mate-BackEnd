class ErrorClass extends Error {
  constructor(status, message, success) {
    super();
    this.status = status;
    this.message = message;
    this.success = success;
  }
}

export default ErrorClass;
