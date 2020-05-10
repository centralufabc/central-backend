import { Router } from 'express';

import SessionController, {
	loginValidation,
} from '../app/controllers/SessionController';

const sessionRouter = Router();

sessionRouter.post('/', loginValidation, SessionController.login);

export default sessionRouter;
