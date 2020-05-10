import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

const generateToken = ({ id, isAdmin }) => {
	return jwt.sign({ id, isAdmin }, authConfig.secret, {
		expiresIn: authConfig.expiresIn,
	});
};

export default generateToken;
