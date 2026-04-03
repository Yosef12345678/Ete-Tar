import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!jwtSecret) {
    return res.status(500).json({ error: 'JWT_SECRET is not set' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'role' in decoded
    ) {
      req.user = {
        userId: String((decoded as JwtPayload).userId),
        role: String((decoded as JwtPayload).role)
      };

      return next();
    }

    return res.status(401).json({ error: 'Invalid access token' });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

export const requireRole =
  (...roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    return next();
  };
