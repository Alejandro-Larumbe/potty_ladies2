import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException'

const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {

    res.status(err.status || 500);
    // const isProduction = environment === 'production';
    const isProduction = true

    const errorData = {
      title: err.title || 'Server Error',
      message: err.message,
      stack: isProduction ? null : err.stack,
      errors: err.errors
    };

    if (err.status === 401) {
      res.set('WWW-Authenticate', 'Bearer');
    }

    console.error(errorData);
    res.json(errorData);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
