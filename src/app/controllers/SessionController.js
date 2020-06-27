import { promisify } from 'util';
import { celebrate, Segments, Joi } from 'celebrate';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import User from '../schemas/User';
import generateToken from '../utils/generateToken';

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
			token: generateToken({ id: user._id, isAdmin: user.isAdmin }),
			user: {
				email,
				name: user.name,
				ra: user.ra,
			},
		});
	}

	async refresh(req, res) {
		const authHeader = req.headers.authorization;

		const [, token] = authHeader.split(' ');

		try {
			await promisify(jwt.verify)(token, authConfig.secret);
		} catch (err) {
			if (err.name !== 'TokenExpiredError') {
				return res.status(401).json({ error: 'Invalid token' });
			}
		}

		const decoded = jwt.decode(token);
		const { id, isAdmin } = decoded;

		return res.json({ token: generateToken({ id, isAdmin }) });
	}
}

export const loginValidation = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

export const refreshTokenValidation = celebrate({
	[Segments.HEADERS]: Joi.object()
		.keys({
			authorization: Joi.string().required(),
		})
		.unknown(true), // REST Client for VS Code sends other headers
});

export default new SessionController();
