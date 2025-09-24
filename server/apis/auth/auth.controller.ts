import { Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { ValidationRequest } from '../../middleware/validation.middleware';
import { AuthenticatedRequest } from './auth.middleware';
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
        return res.status(400).json({
          message: result.message,
          code: 'ADMIN_EXISTS'
        });
      }

      if (!result.user) {
        return res.status(400).json({
          message: 'Registration failed',
        });
      }
      
      res.status(201).json({
        message: 'Registration successful. Please verify your email.',
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
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async verifyEmail(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: VerifyEmailDto = req.validatedBody;
      const result = await authService.verifyEmail(data);
      
      req.login(result.user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Session creation failed' });
        }

        res.json({
          message: 'Email verified successfully',
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
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async login(req: ValidationRequest, res: Response, next: NextFunction) {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Session creation failed' });
        }

        res.json({
          message: 'Login successful',
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
      
      res.json({
        message: 'If this email exists, we will send a password reset link.',
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async resetPassword(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: ResetPasswordDto = req.validatedBody;
      await authService.resetPassword(data);
      
      res.json({
        message: 'Password reset successfully. You can now login with your new password.',
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async refreshToken(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({
          message: 'No active session',
        });
      }

      res.json({
        message: 'Session is active',
        user: req.user,
      });
    } catch (error: any) {
      res.status(401).json({
        message: error.message,
      });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({
            message: 'Logout failed',
          });
        }
        
        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            return res.status(500).json({
              message: 'Session cleanup failed',
            });
          }
          
          res.json({
            message: 'Logout successful',
          });
        });
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Logout failed',
      });
    }
  }



  async resendVerification(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.validatedBody;
      
      const result = await authService.resendVerificationCode(email);
      
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async checkEmailAvailability(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: CheckEmailDto = req.validatedBody;
      const result = await authService.checkEmailAvailability(data);
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async checkWorkspaceAvailability(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: CheckWorkspaceDto = req.validatedBody;
      const result = await authService.checkWorkspaceAvailability(data);
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}