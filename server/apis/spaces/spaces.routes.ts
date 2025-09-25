import { Router } from 'express';
import { SpacesController } from './spaces.controller';
import { authMiddleware } from '../auth/auth.middleware';


const router = Router();
const spacesController = new SpacesController();

router.use(authMiddleware);


export { router as spacesRoutes };