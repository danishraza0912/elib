import { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.NODE_ENV === "development" ? err.stack : "",
  });
};

export default globalErrorHandler