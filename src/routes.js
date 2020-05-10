import { Router } from 'express';

// Middlewares
import authMiddleware from './app/middlewares/auth';
import adminAuthMiddleware from './app/middlewares/adminAuth';

// Controllers
import UserController, {
	createUserValidation,
	updateUserValidation,
} from './app/controllers/UsersController';

import SessionController, {
	loginValidation,
} from './app/controllers/SessionController';

import CalendarController, {
	createEventValidation,
	getUnfinishedEventsValidation,
} from './app/controllers/CalendarController';

import ClassesController, {
	getAllStudentClassesByRaValidation,
} from './app/controllers/ClassesController';

const routes = new Router();

routes.get('/', (req, res) => {
	res.send('Hello Central UFABC!');
});

// Users
routes.post('/users', createUserValidation, UserController.createUser);
// routes.post('/users/reset_password', UserController.resetPassword);

// Sessions
routes.post('/login', loginValidation, SessionController.login);

// Calendar
routes.get(
	'/calendar',
	getUnfinishedEventsValidation,
	CalendarController.getUnfinishedEvents
);

// Classes
routes.get(
	'/classes/:ra',
	getAllStudentClassesByRaValidation,
	ClassesController.getAllStudentClassesByRa
);

// All routes below this line require authentication
routes.use(authMiddleware);

// User
routes.get('/users', UserController.getUser);
routes.put('/users', updateUserValidation, UserController.updateUser);
// routes.put('/users/update_password', UserController.updatePassword);

// Routes below require admin auth
routes.use(adminAuthMiddleware);

// Calendar
routes.post('/calendar', createEventValidation, CalendarController.createEvent);
routes.delete('/calendar/:id', CalendarController.deleteEvent);

export default routes;
