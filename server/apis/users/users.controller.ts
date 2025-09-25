import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { ResponseHelper } from '../../helpers/response.helper';
import { prisma } from '../../helpers/prisma.helper';

export class UsersController {
    async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            if (!user) {
                return ResponseHelper.notFound(res, 'User not found');
            }

            return ResponseHelper.success(res, 'User profile retrieved successfully', { user });
        } catch (error: any) {
            return ResponseHelper.internalError(res, error.message);
        }
    }
}