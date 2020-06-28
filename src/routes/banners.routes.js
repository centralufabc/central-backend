import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';

const bannerRouter = Router();

// Get all available banners
bannerRouter.get('/');

// Increment views
bannerRouter.post('/:id/views');

// Increment clicks
bannerRouter.post('/:id/clicks');

bannerRouter.use(authMiddleware);

// Create Banner
bannerRouter.post('/');

// Disable Banner
bannerRouter.patch('/:id');
