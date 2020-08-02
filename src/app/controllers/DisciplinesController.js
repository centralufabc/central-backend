import { celebrate, Segments, Joi } from 'celebrate';
import Discipline from '../schemas/Discipline';

class DisciplinesController {
	async getDisciplines(req, res) {
		const discipline = await Discipline.findOne({
			sigla: req.params.acronym,
		}).select('-_id');

		if (!discipline) {
			return res.status(404).json({ error: 'Discipline not found' });
		}

		return res.json(discipline);
	}
}

export const getDisciplinesValidation = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		acronym: Joi.string().length(10),
	}),
});

export default new DisciplinesController();
