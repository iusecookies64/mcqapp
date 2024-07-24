import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import client from "../db/postgres";

const devErrors = (res: Response, err: CustomError) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    stacktrace: err.stack,
    err: err,
  });
};

const prodErros = (res: Response, err: CustomError) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else if (err.code === "23505") {
    res.status(403).json({
      message: "Username already exist",
      status: "fail",
    });
  } else {
    res.status(500).json({
      message: "Something Went Wrong! Please Try Again",
      status: "error",
    });
  }
};

export const GlobalErrorHandler: ErrorRequestHandler = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // rolling back if error occurred in middle of any transaction
  await client.query("ROLLBACK");
  if (process.env.NODE_ENV === "development") {
    devErrors(res, err);
  } else if (process.env.NODE_ENV === "production") {
    prodErros(res, err);
  }
};
