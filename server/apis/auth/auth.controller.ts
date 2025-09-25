import { Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { ValidationRequest } from '../../middleware/validation.middleware';
import { AuthenticatedRequest } from './auth.middleware';
import { ResponseHelper } from '../../helpers/response.helper';
import type { 
  RegisterDto, 
  LoginDto, 
  VerifyEmailDto, 
  ForgotPasswordDto, 
  ResetPasswordDto,
  RefreshTokenDto,
  CheckEmailDto,
  CheckWorkspaceDto
} from './auth.dto';
import { IS_PRODUCTION } from '../../server-constants';

const authService = new AuthService();

export class AuthController {
  async register(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: RegisterDto = req.validatedBody;
      const result = await authService.register(data);
      
      if (result.status === 'ADMIN_EXISTS') {
        return ResponseHelper.conflict(res, result.message, 'ADMIN_EXISTS');
      }

      if (!result.user) {
        return ResponseHelper.badRequest(res, 'Registration failed');
      }
      
      return ResponseHelper.created(res, 'Registration successful. Please verify your email.', {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          middleName: result.user.middleName,
          workspaces: result.user.workspaces,
        },
      });
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async verifyEmail(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: VerifyEmailDto = req.validatedBody;
      const result = await authService.verifyEmail(data);
      
      req.login(result.user, (err) => {
        if (err) {
          return ResponseHelper.internalError(res, 'Session creation failed');
        }

        return ResponseHelper.success(res, 'Email verified successfully', {
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            middleName: result.user.middleName,
            emailVerified: result.user.emailVerified,
          },
        });
      });
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async login(req: ValidationRequest, res: Response, next: NextFunction) {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return ResponseHelper.internalError(res, 'Internal server error');
      }
      
      if (!user) {
        return ResponseHelper.unauthorized(res, info?.message || 'Authentication failed');
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return ResponseHelper.internalError(res, 'Session creation failed');
        }

        return ResponseHelper.success(res, 'Login successful', {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt
          },
        });
      });
    })(req, res, next);
  }

  async forgotPassword(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: ForgotPasswordDto = req.validatedBody;
      await authService.forgotPassword(data);
      
      return ResponseHelper.success(res, 'If this email exists, we will send a password reset link.');
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async resetPassword(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: ResetPasswordDto = req.validatedBody;
      await authService.resetPassword(data);
      
      return ResponseHelper.success(res, 'Password reset successfully. You can now login with your new password.');
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async refreshToken(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return ResponseHelper.unauthorized(res, 'No active session');
      }

      return ResponseHelper.success(res, 'Session is active', { user: req.user });
    } catch (error: any) {
      return ResponseHelper.unauthorized(res, error.message);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      req.logout((err) => {
        if (err) {
          return ResponseHelper.internalError(res, 'Logout failed');
        }
        
        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            return ResponseHelper.internalError(res, 'Session cleanup failed');
          }
          
          return ResponseHelper.success(res, 'Logout successful');
        });
      });
    } catch (error: any) {
      return ResponseHelper.internalError(res, 'Logout failed');
    }
  }



  async resendVerification(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.validatedBody;
      
      const result = await authService.resendVerificationCode(email);
      
      return ResponseHelper.success(res, result.message || 'Verification code resent successfully');
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async checkEmailAvailability(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: CheckEmailDto = req.validatedBody;
      const result = await authService.checkEmailAvailability(data);
      
      return ResponseHelper.success(res, 'Email availability checked', result);
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async checkWorkspaceAvailability(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: CheckWorkspaceDto = req.validatedBody;
      const result = await authService.checkWorkspaceAvailability(data);
      
      return ResponseHelper.success(res, 'Workspace availability checked', result);
    } catch (error: any) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }
}