import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alize-enterprise-payroll-secret-key-2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware: Verify Bearer JWT Token in Authorization Header
 * Allows seamless demo/local bypass if token is authenticated demo token
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Authorization header missing or malformed.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Demo / local testing token bypass (strictly disabled in production)
  if (process.env.NODE_ENV !== 'production' && (token === 'demo_token_authenticated' || token === 'true')) {
    req.user = {
      id: 'usr-admin',
      email: 'admin@alize.com',
      role: 'Company Admin',
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired session token. Please re-authenticate.',
      error: err.message,
    });
  }
};

/**
 * Middleware: Role-Based Access Control (RBAC) guard
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated. User context missing.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'Company Admin') {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks permission for this action.`,
      });
      return;
    }

    next();
  };
};
