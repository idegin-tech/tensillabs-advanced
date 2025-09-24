import { Router } from 'express';
import { WorkspacesController } from './workspaces.controller';
import { validateBody, validateParams } from '../../middleware/validation.middleware';
import { authMiddleware } from '../auth/auth.middleware';


const router = Router();
const workspacesController = new WorkspacesController();

router.use(authMiddleware);


export { router as workspacesRoutes };