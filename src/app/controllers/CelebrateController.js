import { celebrate, Segments, Joi } from 'celebrate';

class CelebrateController {
	example(req, res) {
		return res.send({ message: 'ok' });
	}
}

export const exampleValidation = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	}),
	[Segments.QUERY]: Joi.object().keys({
		page: Joi.number(),
	}),
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required().email(),
	}),
});

export default new CelebrateController();
