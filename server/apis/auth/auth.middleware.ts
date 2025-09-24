import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: 'User not found in session',
        code: 'USER_NOT_FOUND'
      });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.userId = req.user?.id;
    }
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};