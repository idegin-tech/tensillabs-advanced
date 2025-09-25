import { Router } from 'express';
import { authRoutes } from './apis/auth/auth.routes';
import { workspacesRoutes } from './apis/workspaces/workspaces.routes';
import { usersRoutes } from './apis/users/users.routes';
import { spacesRoutes } from './apis/spaces/spaces.routes';
import { ResponseHelper } from './helpers/response.helper';

const router = Router();
const apiRouter = Router();

router.get('/', (req, res) => {
    ResponseHelper.success(res, 'Welcome to Tensil API');
});

apiRouter.get('/', (req, res) => {
    ResponseHelper.success(res, 'API v1 endpoint', { version: '1.0.0' });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/workspaces', workspacesRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/spaces', spacesRoutes);

router.use('/api/v1', apiRouter);

export { router };
