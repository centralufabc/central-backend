import { Router } from 'express';

import CalendarController, {
	getUnfinishedEventsValidation,
	createEventValidation,
} from '../app/controllers/CalendarController';

import authMiddleware from '../app/middlewares/auth';
import adminAuthMiddleware from '../app/middlewares/adminAuth';

const calendarRouter = Router();

calendarRouter.get(
	'/',
	getUnfinishedEventsValidation,
	CalendarController.getUnfinishedEvents
);

calendarRouter.use(authMiddleware);
calendarRouter.use(adminAuthMiddleware);

calendarRouter.post('/', createEventValidation, CalendarController.createEvent);
calendarRouter.delete('/:id', CalendarController.deleteEvent);

export default calendarRouter;
