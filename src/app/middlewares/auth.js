import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: 'Token not provided' });
	}

	// Auth header comes in format 'Bearer token', so split it to get just token
	const [, token] = authHeader.split(' ');

	try {
		const decoded = await promisify(jwt.verify)(token, authConfig.secret);

		req.userId = decoded.id;

		return next();
	} catch (err) {
		// TODO: Check for token expired error

		return res.status(401).json({ error: 'Token invalid' });
	}
};
