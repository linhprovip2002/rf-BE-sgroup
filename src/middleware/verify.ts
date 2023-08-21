import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

interface CustomRequest extends Request {
  userToken?: any; // Replace 'any' with the actual type of your 'decoded' object if known.
}

export async function verify(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error(
        'JWT secret is not defined. Please set the JWT_SECRET environment variable.'
      );
    }

    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new Error('No token provided');
    }

    const token = accessToken.split(' ')[1];
    if (token) {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          req.userToken = decoded;
          next();
        }
      });
    } else {
      throw new Error('No token provided');
    }
  } catch (err:any) {
    err.status = 401;
    next(err);
  }
}
