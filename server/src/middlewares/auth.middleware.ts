import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token =
    req.cookies?.jwt ||
    req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const optionalAuthenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token =
    req.cookies?.jwt ||
    req.headers.authorization?.split(' ')[1] ||
    (req.query.token as string);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = { userId: decoded.userId };
  } catch (error) {
    // Ignorujemy błąd i traktujemy usera jako niezalogowanego
  }

  next();
};