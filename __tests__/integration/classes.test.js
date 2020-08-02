import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Class from '../../src/app/schemas/Class';
import Discipline from '../../src/app/schemas/Discipline';

describe('Classes', () => {
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
		await Class.deleteMany();
		await Discipline.deleteMany();
		await mongoose.connection.close();
	});

	it('Should not accept requests with incorrect RA param', async () => {
		// Incorrect
		const response1 = await request(app).get('/classes/123456');
		const response2 = await request(app).get('/classes/123456789');
		const response3 = await request(app).get('/classes/abc');
		const response4 = await request(app).get('/classes/123456789012');

		// Correct
		const response5 = await request(app).get('/classes/12345678');
		const response6 = await request(app).get('/classes/12345678901');

		expect(response1.status).toBe(400);
		expect(response2.status).toBe(400);
		expect(response3.status).toBe(400);
		expect(response4.status).toBe(400);

		expect(response5.status).toBe(200);
		expect(response6.status).toBe(200);
	});

	it('Should return the correct classes for a given RA', async () => {
		await Class.create({
			code: 'A',
			class: 'Programação Orientada a Objetos',
			acronym: 'MCTA018-13',
			raList: ['11033320', '11022219', '11011118'],
		});
		await Class.create({
			code: 'B',
			acronym: 'BCM0505-15',
			class: 'Processamento da Informação',
			raList: ['11033320', '11011118'],
		});

		const response1 = await request(app).get('/classes/11033320');
		expect(response1.body.length).toBe(2);

		const response2 = await request(app).get('/classes/11022219');
		expect(response2.body.length).toBe(1);
	});

	it('it should return discipline info', async () => {
		const response = await request(app).get('/classes/11022219');

		expect(response.body[0].info).toBeDefined();
		expect(response.body[0].info.disciplina).toBe(
			'Programação Orientada a Objetos'
		);
	});
});
