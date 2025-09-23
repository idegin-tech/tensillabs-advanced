import { prisma } from '../../helpers/prisma.helper';
import { 
  hashPassword, 
  generateAccessToken, 
  generateRefreshToken, 
  generateOTP, 
  generateOTPExpiration,
  comparePassword,
  verifyRefreshToken
} from '../../helpers/auth.helper';
import { AuthProvider, SecretType } from '@prisma/client';
import type { 
  RegisterDto, 
  LoginDto, 
  VerifyEmailDto, 
  ForgotPasswordDto, 
  ResetPasswordDto 
} from './auth.dto';

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const otp = generateOTP();
    const otpExpiration = generateOTPExpiration();

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        authProvider: AuthProvider.EMAIL,
      },
    });

    await prisma.userSecret.create({
      data: {
        userId: user.id,
        type: SecretType.EMAIL_VERIFICATION,
        secret: hashedPassword,
        expiresAt: otpExpiration,
      },
    });

    await prisma.userSecret.create({
      data: {
        userId: user.id,
        type: SecretType.PASSWORD_RESET,
        secret: otp,
        expiresAt: otpExpiration,
      },
    });

    // TODO: Send welcome email to user
    // TODO: Send email verification OTP to user.email

    return { user, otp };
  }

  async verifyEmail(data: VerifyEmailDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    const userSecret = await prisma.userSecret.findUnique({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.PASSWORD_RESET,
        },
      },
    });

    if (!userSecret) {
      throw new Error('Verification code not found');
    }

    if (userSecret.expiresAt < new Date()) {
      throw new Error('Verification code expired');
    }

    if (userSecret.secret !== data.otp) {
      throw new Error('Invalid verification code');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.userSecret.delete({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.PASSWORD_RESET,
        },
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.authProvider !== AuthProvider.EMAIL) {
      throw new Error('Please use social login for this account');
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email first');
    }

    const passwordSecret = await prisma.userSecret.findUnique({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.EMAIL_VERIFICATION,
        },
      },
    });

    if (!passwordSecret) {
      throw new Error('Account not properly configured');
    }

    const isValidPassword = await comparePassword(data.password, passwordSecret.secret);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('If this email exists, we will send a password reset link');
    }

    if (user.authProvider !== AuthProvider.EMAIL) {
      throw new Error('Password reset not available for social login accounts');
    }

    const otp = generateOTP();
    const otpExpiration = generateOTPExpiration();

    await prisma.userSecret.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.PASSWORD_RESET,
        },
      },
      create: {
        userId: user.id,
        type: SecretType.PASSWORD_RESET,
        secret: otp,
        expiresAt: otpExpiration,
      },
      update: {
        secret: otp,
        expiresAt: otpExpiration,
      },
    });

    // TODO: Send password reset email with OTP to user.email

    return { otp };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid reset request');
    }

    const resetSecret = await prisma.userSecret.findUnique({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.PASSWORD_RESET,
        },
      },
    });

    if (!resetSecret) {
      throw new Error('Reset code not found');
    }

    if (resetSecret.expiresAt < new Date()) {
      throw new Error('Reset code expired');
    }

    if (resetSecret.secret !== data.otp) {
      throw new Error('Invalid reset code');
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prisma.userSecret.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.EMAIL_VERIFICATION,
        },
      },
      create: {
        userId: user.id,
        type: SecretType.EMAIL_VERIFICATION,
        secret: hashedPassword,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      update: {
        secret: hashedPassword,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.userSecret.delete({
      where: {
        userId_type: {
          userId: user.id,
          type: SecretType.PASSWORD_RESET,
        },
      },
    });

    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async handleSocialLogin(user: any) {
    // TODO: Send welcome email to new social login users if they're new
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  }
}