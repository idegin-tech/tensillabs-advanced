import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { validateBody } from '../../middleware/validation.middleware';
import { authMiddleware } from './auth.middleware';
import { 
  registerDto,
  loginDto,
  verifyEmailDto,
  forgotPasswordDto,
  resetPasswordDto,
  refreshTokenDto
} from './auth.dto';

const router = Router();
const authController = new AuthController();

router.post('/register', validateBody(registerDto), authController.register);
router.post('/verify-email', validateBody(verifyEmailDto), authController.verifyEmail);
router.post('/login', validateBody(loginDto), authController.login);
router.post('/forgot-password', validateBody(forgotPasswordDto), authController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordDto), authController.resetPassword);
router.post('/refresh-token', validateBody(refreshTokenDto), authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

router.get('/google', authController.googleAuth);
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/auth/login?error=google_failed` 
  }),
  authController.googleCallback
);

router.get('/microsoft', authController.microsoftAuth);
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { 
    failureRedirect: `${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/auth/login?error=microsoft_failed` 
  }),
  authController.microsoftCallback
);

export { router as authRoutes };