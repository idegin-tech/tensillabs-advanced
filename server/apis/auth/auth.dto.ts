import { z } from 'zod';

export const loginDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  workspaceName: z.string().min(1, 'Workspace name is required'),
});

export const verifyEmailDto = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export const forgotPasswordDto = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordDto = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const refreshTokenDto = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const resendVerificationDto = z.object({
  email: z.string().email('Invalid email format'),
});

export const checkEmailDto = z.object({
  email: z.string().email('Invalid email format'),
});

export const checkWorkspaceDto = z.object({
  workspaceName: z.string().min(1, 'Workspace name is required'),
});

export type LoginDto = z.infer<typeof loginDto>;
export type RegisterDto = z.infer<typeof registerDto>;
export type CheckEmailDto = z.infer<typeof checkEmailDto>;
export type CheckWorkspaceDto = z.infer<typeof checkWorkspaceDto>;
export type VerifyEmailDto = z.infer<typeof verifyEmailDto>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
export type RefreshTokenDto = z.infer<typeof refreshTokenDto>;
export type ResendVerificationDto = z.infer<typeof resendVerificationDto>;