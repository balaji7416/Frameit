class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status || 500;
    this.message = message || "something went wrong";
    this.success = false;
  }
}

export default ApiError;
