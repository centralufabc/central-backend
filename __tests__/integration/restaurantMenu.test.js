import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import RestaurantMenu from '../../src/app/schemas/RestaurantMenu';

describe('RestaurantMenu', () => {
	afterAll(async () => {
		await RestaurantMenu.deleteMany();
		await mongoose.connection.close();
	});

	it('Should return the correct unfinished restaurant menus', async () => {
		const finishedMenu = {
			day: '2020-01-20',
			lunch: 'Feijoada',
			dinner: 'Feijoada',
			vegetarianOption: 'Feijoada vegana',
			garnish: 'Farofa',
			salads: ['Alface', 'Beterraba'],
			desserts: ['Laranja', 'Mousse de maracujá'],
		};

		const unfinishedMenu = {
			day: '2030-01-20',
			lunch: 'Strogonoff de Frango',
			dinner: 'Strongonoff de Carne',
			vegetarianOption: 'Kibe de PTS',
			garnish: 'Batata Palha',
			salads: ['Alface', 'Beterraba'],
			desserts: ['Laranja', 'Mousse de maracujá'],
		};

		await request(app).post('/restaurant/menu').send(finishedMenu);
		await request(app).post('/restaurant/menu').send(unfinishedMenu);

		const response = await request(app).get('/restaurant/menu');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(1);
		expect(response.body[0].lunch).toBe(unfinishedMenu.lunch);
	});

	it('Should update when they have the same date', async () => {
		const oldMenu = {
			day: '2030-01-20',
			lunch: 'Strogonoff de Frango',
			dinner: 'Strongonoff de Carne',
			vegetarianOption: 'Kibe de PTS',
			garnish: 'Batata Palha',
			salads: ['Alface', 'Beterraba'],
			desserts: ['Laranja', 'Mousse de maracujá'],
		};

		const newMenu = {
			day: '2030-01-20',
			lunch: 'Feijoada',
			dinner: 'Feijoada',
			vegetarianOption: 'Feijoada vegana',
			garnish: 'Farofa',
			salads: ['Alface', 'Beterraba'],
			desserts: ['Laranja', 'Mousse de maracujá'],
		};

		await request(app).post('/restaurant/menu').send(oldMenu);
		await request(app).post('/restaurant/menu').send(newMenu);

		const response = await request(app).get('/restaurant/menu');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(1);
		expect(response.body[0].lunch).toBe(newMenu.lunch);
	});
});
