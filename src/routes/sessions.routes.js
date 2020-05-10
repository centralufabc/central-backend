import { Router } from 'express';

import SessionController, {
	loginValidation,
	refreshTokenValidation,
} from '../app/controllers/SessionController';

const sessionRouter = Router();

sessionRouter.post('/', loginValidation, SessionController.login);
sessionRouter.post(
	'/refresh',
	refreshTokenValidation,
	SessionController.refresh
);

export default sessionRouter;
