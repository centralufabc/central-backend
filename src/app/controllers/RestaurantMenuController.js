import { celebrate, Segments, Joi } from 'celebrate';
import RestaurantMenu from '../schemas/RestaurantMenu';

class RestaurantMenuController {
	async createRestaurantMenu(req, res) {
		const result = await RestaurantMenu.findOneAndUpdate(
			{ day: req.body.day },
			req.body,
			{
				new: true,
				upsert: true,
			}
		);

		return res.json(result);
	}

	async getUnfinishedRestaurantMenus(req, res) {
		const now = new Date();

		const { page = 1, limit = 6 } = req.query;

		const restaurantMenus = await RestaurantMenu.find({ day: { $gte: now } })
			.skip((page - 1) * limit)
			.limit(limit);

		return res.json(restaurantMenus);
	}
}

export const createRestaurantMenuValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		day: Joi.date().iso().required(),
		lunch: Joi.string().required(),
		dinner: Joi.string(),
		vegetarianOption: Joi.string().required(),
		garnish: Joi.string().required(),
		salads: Joi.array().items(Joi.string()).required(),
		desserts: Joi.array().items(Joi.string()).required(),
	}),
});

export const getUnfinishedRestaurantMenusValidation = celebrate({
	[Segments.QUERY]: Joi.object().keys({
		page: Joi.number().min(1),
		limit: Joi.number().min(1).max(10),
	}),
});

export default new RestaurantMenuController();
