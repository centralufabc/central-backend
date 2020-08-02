import { Router } from 'express';
import DisciplinesController, {
	getDisciplinesValidation,
} from '../app/controllers/DisciplinesController';

const disciplinesRouter = Router();

disciplinesRouter.get(
	'/:acronym',
	getDisciplinesValidation,
	DisciplinesController.getDisciplines
);

export default disciplinesRouter;
