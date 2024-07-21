export default class CustomError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;
    this.code = "0";

    Error.captureStackTrace(this, this.constructor);
  }
}
