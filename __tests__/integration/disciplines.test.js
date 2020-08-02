import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Discipline from '../../src/app/schemas/Discipline';

describe('Disciplines', () => {
	beforeAll(async () => {
		await Discipline.create({
			sigla: 'MCTA018-13',
			disciplina: 'Programação Orientada a Objetos',
			tpi: '2-2-4',
			recomendacao: 'Programação Estruturada',
			ementa: 'test',
			basica: 'test',
			complementar: 'test',
		});
	});

	afterAll(async () => {
		await Discipline.deleteMany();
		await mongoose.connection.close();
	});

	it('should return the correct discipline', async () => {
		const response = await request(app).get('/disciplines/MCTA018-13');

		expect(response.body.disciplina).toBe('Programação Orientada a Objetos');
	});

	it('should return an error if an incorrect discipline code is provided', async () => {
		const response = await request(app).get('/disciplines/MCTA019-13');

		expect(response.status).toBe(404);
	});

	it('should return an error if an invalid code is provided (length != 10)', async () => {
		const response = await request(app).get('/disciplines/MCTA018-424');

		expect(response.status).toBe(400);
	});
});
