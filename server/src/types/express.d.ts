import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser extends JwtPayload{
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}