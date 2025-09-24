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
  refreshTokenDto,
  resendVerificationDto
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
router.post('/resend-verification', validateBody(resendVerificationDto), authController.resendVerification);



export { router as authRoutes };