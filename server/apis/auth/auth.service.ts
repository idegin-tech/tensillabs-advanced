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
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await hashPassword(data.password);
        const emailVerificationOtp = generateOTP();
        const emailVerificationExp = generateOTPExpiration();

        const user = await prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                userSecret: {
                    create: {
                        hashedPassword,
                        emailVerificationOtp,
                        emailVerificationExp,
                    }
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                middleName: true,
                emailVerified: true,
                createdAt: true
            }
        });

        // TODO: Send welcome email to user
        // TODO: Send email verification OTP to user.email

        return {
            message: 'User registered successfully. Please check your email for verification.',
            user,
        };
    }

    async verifyEmail(data: VerifyEmailDto) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { userSecret: true }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            throw new Error('Email already verified');
        }

        if (!user.userSecret?.emailVerificationOtp) {
            throw new Error('No verification code found. Please register again.');
        }

        if (!user.userSecret.emailVerificationExp || user.userSecret.emailVerificationExp < new Date()) {
            throw new Error('Verification code expired. Please register again.');
        }

        if (user.userSecret.emailVerificationOtp !== data.otp) {
            throw new Error('Invalid verification code');
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { 
                emailVerified: new Date(),
                userSecret: {
                    update: {
                        emailVerificationOtp: null,
                        emailVerificationExp: null,
                    }
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                middleName: true,
                emailVerified: true,
                createdAt: true
            }
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return { 
            message: 'Email verified successfully',
            user: updatedUser, 
            accessToken, 
            refreshToken 
        };
    }

    async login(data: LoginDto) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { userSecret: true }
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in');
        }

        if (!user.userSecret?.hashedPassword) {
            throw new Error('Account not properly configured. Please contact support.');
        }

        const isValidPassword = await comparePassword(data.password, user.userSecret.hashedPassword);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return { 
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
            accessToken, 
            refreshToken 
        };
    }

    async forgotPassword(data: ForgotPasswordDto) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { userSecret: true }
        });

        if (!user) {
            return { message: 'If this email exists, we will send a password reset code.' };
        }



        const passwordResetOtp = generateOTP();
        const passwordResetExp = generateOTPExpiration();

        await prisma.userSecret.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                passwordResetOtp,
                passwordResetExp,
            },
            update: {
                passwordResetOtp,
                passwordResetExp,
            },
        });

        // TODO: Send password reset email with OTP to user.email

        return { message: 'Password reset code sent to your email.' };
    }

    async resetPassword(data: ResetPasswordDto) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { userSecret: true }
        });

        if (!user) {
            throw new Error('Invalid reset request');
        }

        if (!user.userSecret?.passwordResetOtp) {
            throw new Error('No reset code found. Please request a new one.');
        }

        if (!user.userSecret.passwordResetExp || user.userSecret.passwordResetExp < new Date()) {
            throw new Error('Reset code expired. Please request a new one.');
        }

        if (user.userSecret.passwordResetOtp !== data.otp) {
            throw new Error('Invalid reset code');
        }

        const hashedPassword = await hashPassword(data.newPassword);

        await prisma.userSecret.update({
            where: { userId: user.id },
            data: {
                hashedPassword,
                passwordResetOtp: null,
                passwordResetExp: null,
            },
        });

        return { message: 'Password reset successfully. You can now login with your new password.' };
    }

    async refreshToken(refreshToken: string) {
        try {
            const decoded = verifyRefreshToken(refreshToken);

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    emailVerified: true,
                    createdAt: true
                }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const newAccessToken = generateAccessToken(user.id);
            const newRefreshToken = generateRefreshToken(user.id);

            return { 
                message: 'Token refreshed successfully',
                user,
                accessToken: newAccessToken, 
                refreshToken: newRefreshToken 
            };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }



    async resendVerificationCode(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { userSecret: true }
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            throw new Error('Email already verified');
        }

        const emailVerificationOtp = generateOTP();
        const emailVerificationExp = generateOTPExpiration();

        await prisma.userSecret.update({
            where: { userId: user.id },
            data: {
                emailVerificationOtp,
                emailVerificationExp,
            },
        });

        // TODO: Send new email verification OTP to user.email

        return { message: 'Verification code sent to your email.' };
    }
}