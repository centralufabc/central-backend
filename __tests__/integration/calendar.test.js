import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import CalendarEvent from '../../src/app/schemas/CalendarEvent';
import User from '../../src/app/schemas/User';

describe('Calendar', () => {
	let adminToken;
	let notAdminToken;

	beforeAll(async () => {
		// Create two users and get their tokens
		// Admin
		const adminRequest = await request(app).post('/users').send({
			name: 'Admin',
			email: 'admin@ufabc.edu.br',
			password: 'qwerty',
		});

		// Update isAdmin field of the first user
		const admin = adminRequest.body;
		await User.findByIdAndUpdate(admin._id, { isAdmin: true }, { new: true });

		const adminLogin = await request(app).post('/sessions').send({
			email: 'admin@ufabc.edu.br',
			password: 'qwerty',
		});

		adminToken = adminLogin.body.token;

		// Not admin
		await request(app).post('/users').send({
			name: 'Not Admin',
			email: 'notadmin@aluno.ufabc.edu.br',
			password: 'qwerty',
		});

		const notAdminLogin = await request(app).post('/sessions').send({
			email: 'notadmin@ufabc.edu.br',
			password: 'qwerty',
		});

		notAdminToken = notAdminLogin.body.token;
	});

	beforeEach(async () => {
		//
	});

	afterAll(async () => {
		// Remove all documents from Calendar collection
		await User.deleteMany();
		await CalendarEvent.deleteMany();
		await mongoose.connection.close();
	});

	// ##### LIST CALENDAR EVENT #####
	it('should return upcoming and unfinished events', async () => {
		// Create some events
		// Past event, should not appear
		await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 1',
				type: 'acad',
				startDate: '2020-01-20T12:00:00-03:00',
			});

		// Unfinished event, should appear
		const res2 = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 2',
				type: 'acad',
				startDate: '2020-01-20T12:00:00-03:00',
				endDate: '2030-01-20T12:00:00-03:00',
			});

		// Upcoming event, should appear
		const res3 = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 3',
				type: 'acad',
				startDate: '2030-01-20T12:00:00-03:00',
			});

		const expectedIds = [res2.body._id, res3.body._id];

		// Check if route returns upcoming and unfinished events
		const response = await request(app).get('/calendar');

		const events = response.body;

		let match = true;
		expectedIds.forEach((eventId) => {
			if (!events.filter((event) => event._id === eventId)) {
				match = false;
			}
		});

		expect(match).toBe(true);
	});

	// ##### CREATE CALENDAR EVENT #####
	it('Should create an event, which should contain all the data sent', async () => {
		const data = {
			title: 'Test A',
			subtitle: 'Subtitle from test A',
			type: 'acad',
			startDate: '2020-04-20T12:00:00-03:00',
			endDate: '2020-06-16T12:00:00-03:00',
			showTime: true,
			imgUrl:
				'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
			link:
				'http://www.ufabc.edu.br/sobre-o-coronavirus/consepe-aprova-estudos-continuados-emergenciais',
		};

		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(data);

		// Get event directly from DB to compare
		const event = await CalendarEvent.findById(response.body._id);

		data.startDate = new Date('2020-04-20T12:00:00-03:00'); // Time in UTC
		data.endDate = new Date('2020-06-16T12:00:00-03:00'); // Time in UTC

		expect(event).toMatchObject(data);
	});

	it('Should create an event, which should contain all the minimum data sent', async () => {
		const data = {
			title: 'Test A',
			type: 'acad',
			startDate: '2020-04-20T12:00:00-03:00',
		};

		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(data);

		// Get event directly from DB to compare
		const event = await CalendarEvent.findById(response.body._id);
		data.startDate = new Date('2020-04-20T12:00:00-03:00'); // Time in UTC

		expect(event).toMatchObject(data);
	});

	it('Should return an error when title is not specified on create', async () => {
		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				// title: 'Test 1', -> Missing title
				type: 'acad',
				startDate: '2020-04-20T12:00:00-03:00',
			});

		expect(response.status).toBe(400);
	});

	it('Should return an error when type is not specified on create', async () => {
		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 1',
				// type: 'acad', -> Missing type
				startDate: '2020-04-20T12:00:00-03:00',
			});

		expect(response.status).toBe(400);
	});

	it('Should return an error when startDate is not specified on create', async () => {
		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 1',
				type: 'acad',
				// startDate: '2020-04-20T12:00:00-03:00', -> Missing start date
			});

		expect(response.status).toBe(400);
	});

	it('should not allow startDate > endDate', async () => {
		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 1',
				type: 'acad',
				startDate: '2025-01-02T12:00:00-03:00', // startDate > endDate
				endDate: '2025-01-01T12:00:00-03:00',
			});

		expect(response.status).toBe(400);
	});

	// ##### DELETE CALENDAR EVENT #####
	it('Should return an error when trying to delete an event that does not exist', async () => {
		const response = await request(app)
			.delete('/calendar/5e8b793b8b28ac157d7f140f')
			.set('Authorization', `Bearer ${adminToken}`)
			.send();

		expect(response.status).toBe(404);
	});

	it('Should return ok when trying to delete an event that does exist', async () => {
		// Create an event and get its id
		const responseCreate = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 1',
				type: 'acad',
				startDate: '2020-04-20T12:00:00-03:00',
			});

		// Try to delete event
		const responseDelete = await request(app)
			.delete(`/calendar/${responseCreate.body._id}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send();

		expect(responseDelete.status).toBe(204);
	});

	it('Should not be able to create an event with a normal user', async () => {
		const data = {
			title: 'Test A',
			type: 'acad',
			startDate: '2020-04-20T12:00:00-03:00',
		};

		const response = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send(data);

		expect(response.status).toBe(401);
	});

	it('Should not be able to delete an event with a normal user', async () => {
		// Create an event and get its id
		const responseCreate = await request(app)
			.post('/calendar')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				title: 'Test 1',
				type: 'acad',
				startDate: '2020-04-20T12:00:00-03:00',
			});

		// Try to delete event
		const responseDelete = await request(app)
			.delete(`/calendar/${responseCreate.body._id}`)
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send();

		expect(responseDelete.status).toBe(401);
	});
});
