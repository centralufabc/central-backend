import bcrypt from 'bcryptjs';
import { celebrate, Segments, Joi } from 'celebrate';
import User from '../schemas/User';

class UserController {
	async createUser(req, res) {
		const { name, email, password, ra } = req.body;

		// Check if email has an UFABC domain
		const [_, domain] = email.split('@');

		if (!domain.includes('ufabc.edu.br')) {
			return res
				.status(400)
				.json({ error: '"email" must be a valid UFABC email address' });
		}

		// Check if email already exists in db
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ error: 'Email is already in use' });
		}

		const passwordHash = await bcrypt.hash(password, 8);
		const createdUser = await User.create({ name, email, passwordHash, ra });

		return res.json(createdUser);
	}

	async getUser(req, res) {
		const user = await User.findById(req.userId).select('name email ra');

		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		return res.json(user);
	}

	async updateUser(req, res) {
		const { name, ra } = req.body;

		const user = await User.findById(req.userId);

		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		user.name = name;
		user.ra = ra;

		const updatedUser = await user.save();

		return res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			ra: updatedUser.ra,
		});
	}
}

export const createUserValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

export const updateUserValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string(),
		ra: Joi.alternatives()
			.try(Joi.string().length(8), Joi.string().length(11))
			.error(new Error('Invalid RA')),
	}),
});

export default new UserController();
