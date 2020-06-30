import { Router } from 'express';

import BannersController from '../app/controllers/BannersController';

import authMiddleware from '../app/middlewares/auth';

const bannerRouter = Router();

// Get all available banners
// bannerRouter.get('/');

// // Increment views
// bannerRouter.post('/:id/views');

// // Increment clicks
// bannerRouter.post('/:id/clicks');

bannerRouter.use(authMiddleware);

// Create Banner
bannerRouter.post('/', BannersController.createBanner);

// Disable Banner
bannerRouter.patch('/:id', BannersController.disableBanner);

export default bannerRouter;
