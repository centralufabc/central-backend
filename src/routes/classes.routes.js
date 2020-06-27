import { Router } from 'express';

import ClassesController, {
	getAllStudentClassesByRaValidation,
} from '../app/controllers/ClassesController';

const classesRouter = Router();

classesRouter.get(
	'/:ra',
	getAllStudentClassesByRaValidation,
	ClassesController.getAllStudentClassesByRa
);

export default classesRouter;
