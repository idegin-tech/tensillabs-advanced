import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../../helpers/response.helper';

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
      return ResponseHelper.unauthorized(res, 'Authentication required', 'AUTH_REQUIRED');
    }

    const user = req.user;
    if (!user) {
      return ResponseHelper.unauthorized(res, 'User not found in session', 'USER_NOT_FOUND');
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return ResponseHelper.internalError(res, 'Internal server error', 'INTERNAL_ERROR');
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