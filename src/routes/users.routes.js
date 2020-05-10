import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';

import UserController, {
	createUserValidation,
	updateUserValidation,
} from '../app/controllers/UsersController';

const userRouter = Router();

userRouter.post('/', createUserValidation, UserController.createUser);
// TODO: Reset user password
// routes.post('/password', UserController.resetPassword);

userRouter.use(authMiddleware);

userRouter.get('/', UserController.getUser);
userRouter.put('/', updateUserValidation, UserController.updateUser);
// TODO: Update user password
// userRouter.put('/password', UserController.updatePassword);

export default userRouter;
