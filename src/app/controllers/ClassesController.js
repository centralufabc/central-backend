import { celebrate, Segments, Joi } from 'celebrate';
import Class from '../schemas/Class';

class ClassController {
	async getClassesByRa(req, res) {
		// Get all classes that include student with provided RA
		const classes = await Class.find({ listaRa: req.params.ra }).select(
			'-listaRa'
		);

		return res.json(classes);
	}
}

export const getClassesByRaValidation = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		ra: Joi.alternatives()
			.try(Joi.string().length(8), Joi.string().length(11))
			.error(new Error('RA inválido')),
	}),
});

export default new ClassController();
