import { Router } from 'express';

// Middlewares
import authMiddleware from './app/middlewares/auth';

// Controllers
import CalendarController, {
	createEventValidation,
	getUnfinishedEventsValidation,
} from './app/controllers/CalendarController';
import ClassesController, {
	getAllStudentClassesByRaValidation,
} from './app/controllers/ClassesController';
import RestaurantMenuController, {
	createRestaurantMenuValidation,
	getUnfinishedRestaurantMenusValidation,
} from './app/controllers/RestaurantMenuController';

const routes = new Router();

routes.get('/', (req, res) => {
	res.send('Hello Central UFABC!');
});

// Calendar
routes.get(
	'/calendar',
	getUnfinishedEventsValidation,
	CalendarController.getUnfinishedEvents
);
routes.post('/calendar', createEventValidation, CalendarController.createEvent);
routes.delete('/calendar/:id', CalendarController.deleteEvent);

// Classes
routes.get(
	'/classes/:ra',
	getAllStudentClassesByRaValidation,
	ClassesController.getAllStudentClassesByRa
);

routes.get(
	'/restaurant/menu',
	getUnfinishedRestaurantMenusValidation,
	RestaurantMenuController.getUnfinishedRestaurantMenus
);

routes.post(
	'/restaurant/menu',
	createRestaurantMenuValidation,
	RestaurantMenuController.createRestaurantMenu
);

// All routes below this line require authentication
routes.use(authMiddleware);

export default routes;
