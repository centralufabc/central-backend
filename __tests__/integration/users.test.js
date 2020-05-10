import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import User from '../../src/app/schemas/User';

describe('Users', () => {
	const userCredentials = {
		email: 'userufabc@aluno.ufabc.edu.br',
		password: 'qwerty',
	};
	const userData = {
		name: 'User Ufabc',
		email: userCredentials.email,
		ra: '11010112',
	};
	const createData = {
		name: userData.name,
		ra: userData.ra,
		email: userCredentials.email,
		password: userCredentials.password,
	};

	let userToken;

	afterAll(async () => {
		// Remove all documents from Calendar collection
		await User.deleteMany();
		await mongoose.connection.close();
	});

	it('Should be able to create a user', async () => {
		const response = await request(app).post('/users').send(createData);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(userData);
		expect(response.body).not.toHaveProperty('password');
	});

	it('Should not return user data unless token is in request header', async () => {
		const response = await request(app).get('/users').send();

		expect(response.status).toBe(401);
	});

	it('Should return all user data', async () => {
		const loginResponse = await request(app)
			.post('/sessions')
			.send(userCredentials);

		expect(loginResponse.body).toHaveProperty('token');
		userToken = loginResponse.body.token;

		const response = await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${userToken}`)
			.send();

		expect(response.body).toMatchObject(userData);
	});

	it('Should be able to update user data', async () => {
		const newData = { name: 'Michael Scott', ra: '11201601111' };

		const responseUpdate = await request(app)
			.put('/users')
			.set('Authorization', `Bearer ${userToken}`)
			.send(newData);

		expect(responseUpdate.status).toBe(200);

		const response = await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${userToken}`)
			.send();

		expect(response.body).toMatchObject(newData);
	});

	it('Should not be able to update user data if token is missing', async () => {
		const newData = { name: 'Michael Scott', ra: '11201601111' };

		const responseUpdate = await request(app).put('/users').send(newData);

		expect(responseUpdate.status).toBe(401);
	});

	it('Should not be able to create an user with an email already in use', async () => {
		const response = await request(app).post('/users').send(createData);

		expect(response.status).toBe(400);
	});
});
