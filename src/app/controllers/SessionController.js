import { celebrate, Segments, Joi } from 'celebrate';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import User from '../schemas/User';

class SessionController {
	async login(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: 'Invalid email/password' });
		}

		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid email/password' });
		}

		return res.json({
			token: jwt.sign(
				{ id: user._id, isAdmin: user.isAdmin },
				authConfig.secret,
				{ expiresIn: authConfig.expiresIn }
			),
			user: {
				email,
				name: user.name,
				ra: user.ra,
			},
		});
	}
}

export const loginValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

export default new SessionController();
