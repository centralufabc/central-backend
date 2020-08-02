import { Router } from 'express';
import DisciplinesController from '../app/controllers/DisciplinesController';

const disciplinesRouter = Router();

disciplinesRouter.get('/:acronym', DisciplinesController.getDisciplines);

export default disciplinesRouter;
