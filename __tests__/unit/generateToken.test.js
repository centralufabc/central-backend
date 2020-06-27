import jwt from 'jsonwebtoken';
import generateToken from '../../src/app/utils/generateToken';

test('Generated token should contain all properties', () => {
	const data = { id: '5e925bcdb46f751bd8458036', isAdmin: true };

	const token = generateToken(data);
	const decoded = jwt.decode(token);

	expect(decoded).toMatchObject(data);
});
