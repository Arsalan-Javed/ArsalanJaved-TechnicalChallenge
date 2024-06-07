class ApiError extends Error {
    statusCode: number;
    error: object | null = null;
  
    constructor(statusCode: number, message: string|undefined, errorObj: object | null = null) {
      if (!message) {
        message = "Some error occured"
      }
      super(message);
      this.statusCode = statusCode;
      if (errorObj) {
        this.error = errorObj;
      }
    }
  }
  
  export default ApiError;
  