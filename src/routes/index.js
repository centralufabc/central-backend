import { Router } from 'express';

// Routers
import userRouter from './users.routes';
import sessionRouter from './sessions.routes';
import calendarRouter from './calendar.routes';
import classesRouter from './classes.routes';
import disciplinesRouter from './disciplines.routes';
import bannersRouter from './banners.routes';

const routes = Router();

routes.get('/', (req, res) => {
	res.send('Hello Central UFABC!');
});
routes.use('/users', userRouter);
routes.use('/sessions', sessionRouter);
routes.use('/calendar', calendarRouter);
routes.use('/classes', classesRouter);
routes.use('/disciplines', disciplinesRouter);
routes.use('/banners', bannersRouter);

export default routes;
