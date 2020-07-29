import { Router } from 'express';

import BannersController from '../app/controllers/BannersController';

import authMiddleware from '../app/middlewares/auth';

const bannerRouter = Router();

// Get all available banners
bannerRouter.get('/', BannersController.getBanners);

// Increment views
bannerRouter.post('/:id/views', BannersController.incrementViews);

// Increment clicks
bannerRouter.post('/:id/clicks', BannersController.incrementClicks);

bannerRouter.use(authMiddleware);

// Create Banner
bannerRouter.post('/', BannersController.createBanner);

// Get User Banners
bannerRouter.get('/my', BannersController.getUserBanners);

// Disable Banner
bannerRouter.patch('/:id', BannersController.disableBanner);

export default bannerRouter;
