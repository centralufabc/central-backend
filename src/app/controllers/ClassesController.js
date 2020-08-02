import { celebrate, Segments, Joi } from 'celebrate';
import Class from '../schemas/Class';
import Discipline from '../schemas/Discipline';

class ClassController {
	async getAllStudentClassesByRa(req, res) {
		const classes = await Class.find({ raList: req.params.ra }).select(
			'-raList'
		);

		const result = [];

		// Add discipline info
		await Promise.all(
			classes.map(async (aClass) => {
				const info = await Discipline.findOne({ sigla: aClass.acronym });

				result.push({ ...aClass.toObject(), info });
			})
		);

		return res.json(result);
	}
}

export const getAllStudentClassesByRaValidation = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		ra: Joi.alternatives()
			.try(Joi.string().length(8), Joi.string().length(11))
			.error(new Error('Invalid RA')),
	}),
});

export default new ClassController();
