import { celebrate, Segments, Joi } from 'celebrate';
import CalendarEvent from '../schemas/CalendarEvent';

class CalendarController {
	async createEvent(req, res) {
		const result = await CalendarEvent.create(req.body);

		return res.json(result);
	}

	/**
	 * Return upcoming and unfinished events
	 */
	async getEvents(req, res) {
		const now = new Date();

		const { page = 1, limit = 5 } = req.query;

		const events = await CalendarEvent.find({
			$or: [{ startDate: { $gte: now } }, { endDate: { $gte: now } }],
		})
			.skip((page - 1) * limit)
			.limit(limit);

		return res.json(events);
	}

	async deleteEvent(req, res) {
		const { id } = req.params;

		const event = await CalendarEvent.findById(id);

		if (!event) {
			return res.status(404).json({ error: 'Calendar event not found' });
		}

		await CalendarEvent.findByIdAndDelete(id);
		return res.status(204).send();
	}
}

export const getEventsValidation = celebrate({
	[Segments.QUERY]: Joi.object().keys({
		page: Joi.number().min(1),
		limit: Joi.number().min(5).max(10),
	}),
});

export const createEventValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		title: Joi.string().required(),
		subtitle: Joi.string(),
		type: Joi.string().valid('party', 'acad', 'other').required(),
		startDate: Joi.date().iso().required(),
		endDate: Joi.date().iso().min(Joi.ref('startDate')),
		showTime: Joi.boolean(),
		imgUrl: Joi.string(),
		link: Joi.string(),
	}),
});

export default new CalendarController();
