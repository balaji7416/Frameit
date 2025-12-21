class ApiResponse {
  constructor(status, message, data = null) {
    this.success = status < 400;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
