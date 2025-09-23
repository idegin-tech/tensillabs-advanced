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
          name: result.user.name,
          authProvider: result.user.authProvider,
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: 'Email verified successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          authProvider: result.user.authProvider,
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
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }

      authService.handleSocialLogin(user)
        .then((result) => {
          res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 24 * 60 * 60 * 1000,
          });

          res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });

          res.json({
            message: 'Login successful',
            user: {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              authProvider: result.user.authProvider,
              emailVerified: result.user.emailVerified,
            },
            accessToken: result.accessToken,
          });
        })
        .catch((error) => {
          res.status(500).json({ message: 'Login processing failed' });
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
      const refreshToken = req.cookies?.refreshToken || req.validatedBody?.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          message: 'Refresh token required',
        });
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
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

  googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });

  async googleCallback(req: any, res: Response, next: NextFunction) {
    try {
      const result = await authService.handleSocialLogin(req.user);
      
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/auth/callback?success=true`);
    } catch (error) {
      res.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/auth/callback?error=auth_failed`);
    }
  }

  microsoftAuth = passport.authenticate('microsoft', {
    scope: ['user.read'],
  });

  async microsoftCallback(req: any, res: Response, next: NextFunction) {
    try {
      const result = await authService.handleSocialLogin(req.user);
      
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/auth/callback?success=true`);
    } catch (error) {
      res.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/auth/callback?error=auth_failed`);
    }
  }
}