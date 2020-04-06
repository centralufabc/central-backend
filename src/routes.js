import { Router } from 'express';

// Middlewares
import authMiddleware from './app/middlewares/auth';

// Controllers
import CelebrateController, {
	exampleValidation,
} from './app/controllers/CelebrateController';
import CalendarController, {
	createEventValidation,
	getEventsValidation,
} from './app/controllers/CalendarController';

const routes = new Router();

routes.get('/', (req, res) => {
	res.send('Hello World!');
});

// Celebrate validation example
// Validates req params, req query and req body
// Valid request example:
// curl --request POST \
//   --url 'http://localhost:3333/celebrate/1?page=1' \
//   --header 'content-type: application/json' \
//   --data '{
// 	"email": "jill@stars.com"
// }'
routes.post('/celebrate/:id', exampleValidation, CelebrateController.example);

routes.get('/calendar', getEventsValidation, CalendarController.getEvents);
routes.post('/calendar', createEventValidation, CalendarController.createEvent);
routes.delete('/calendar/:id', CalendarController.deleteEvent);

// All routes below this line require authentication
routes.use(authMiddleware);

export default routes;
