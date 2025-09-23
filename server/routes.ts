import { Router } from 'express';
import { authRoutes } from './apis/auth/auth.routes';

const router = Router();
const apiRouter = Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Tensil API',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

apiRouter.get('/', (req, res) => {
    res.json({
        message: 'API v1 endpoint',
        status: 'success',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

apiRouter.use('/auth', authRoutes);

router.use('/api/v1', apiRouter);

export { router };
