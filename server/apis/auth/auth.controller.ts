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
  RefreshTokenDto
} from './auth.dto';
import { IS_PRODUCTION } from '../../server-constants';

const authService = new AuthService();

export class AuthController {
  async register(req: ValidationRequest, res: Response, next: NextFunction) {
    try {
      const data: RegisterDto = req.validatedBody;
      const result = await authService.register(data);
      
      res.status(201).json({
        message: 'Registration successful. Please verify your email.',
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          middleName: result.user.middleName,
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
      
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

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
        accessToken: result.accessToken,
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

      try {
        const data = req.validatedBody as { email: string; password: string };
        const result = await authService.login(data);
        
        res.cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: IS_PRODUCTION,
          sameSite: 'strict',
          maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: IS_PRODUCTION,
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
          message: result.message,
          user: result.user,
          accessToken: result.accessToken,
        });
      } catch (error: any) {
        return res.status(401).json({
          message: error.message,
        });
      }
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
      const refreshToken = req.cookies?.refreshToken || req.validatedBody?.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          message: 'Refresh token required',
        });
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: 'Token refreshed successfully',
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(401).json({
        message: error.message,
      });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      
      res.json({
        message: 'Logout successful',
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
}