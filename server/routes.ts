import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Tensil API',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

router.use('/api/v1', (req, res) => {
    res.json({
        message: 'API v1 endpoint',
        status: 'success',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

export { router };
