import { Router } from 'express';

// Middlewares
import authMiddleware from './app/middlewares/auth';

// Controllers
import CelebrateController, {
	exampleValidation,
} from './app/controllers/CelebrateController';

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

// All routes below this line require authentication
routes.use(authMiddleware);

export default routes;
