import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();
const usersController = new UsersController();

router.use(authMiddleware);

router.get('/profile', usersController.getProfile);

export { router as usersRoutes };