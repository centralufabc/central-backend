import request from 'supertest';
import app from '../../src/app';
import CalendarEvent from '../../src/app/schemas/CalendarEvent';

describe('Calendar', () => {
	beforeEach(async () => {
		//
	});

	afterAll(async () => {
		// Remove all documents from Calendar collection
		await CalendarEvent.deleteMany();
	});

	// LIST CALENDAR EVENT
	it('should return upcoming and unfinished events', async () => {
		// Create some events
		// Past event, should not appear
		await request(app).post('/calendar').send({
			title: 'Test 1',
			type: 'acad',
			startDate: '2020-01-20T12:00:00-03:00',
		});

		// Unfinished event, should appear
		const res2 = await request(app).post('/calendar').send({
			title: 'Test 2',
			type: 'acad',
			startDate: '2020-01-20T12:00:00-03:00',
			endDate: '2030-01-20T12:00:00-03:00',
		});

		// Upcoming event, should appear
		const res3 = await request(app).post('/calendar').send({
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

		const response = await request(app).post('/calendar').send(data);

		// Get event directly from DB to compare
		const event = await CalendarEvent.findById(response.body._id);

		let match;
		if (event) {
			match = true;
			Object.keys(data).forEach((key) => {
				// Date fields check. DB converts to UTC on insertion, so compare date in milis
				if (key === 'startDate' || key === 'endDate') {
					const dateSent = new Date(data[key]).getTime();
					const dateCreated = new Date(event[key]).getTime();

					if (dateSent !== dateCreated) {
						match = false;
					}
				}
				// All other fields must be equal
				else if (data[key] !== event[key]) {
					match = false;
				}
			});
		}

		expect(match).toBe(true);
	});

	it('Should create an event, which should contain all the minimum data sent', async () => {
		const data = {
			title: 'Test A',
			type: 'acad',
			startDate: '2020-04-20T12:00:00-03:00',
		};

		const response = await request(app).post('/calendar').send(data);

		// Get event directly from DB to compare
		const event = await CalendarEvent.findById(response.body._id);

		let match;
		if (event) {
			match = true;
			Object.keys(data).forEach((key) => {
				// Date fields check. DB converts to UTC on insertion, so compare date in milis
				if (key === 'startDate' || key === 'endDate') {
					const dateSent = new Date(data[key]).getTime();
					const dateCreated = new Date(event[key]).getTime();

					if (dateSent !== dateCreated) {
						match = false;
					}
				}
				// All other fields must be equal
				else if (data[key] !== event[key]) {
					match = false;
				}
			});
		}

		expect(match).toBe(true);
	});

	it('Should return an error when title is not specified on create', async () => {
		const response = await request(app).post('/calendar').send({
			// title: 'Test 1', -> Missing title
			type: 'acad',
			startDate: '2020-04-20T12:00:00-03:00',
		});

		expect(response.status).toBe(400);
	});

	it('Should return an error when type is not specified on create', async () => {
		const response = await request(app).post('/calendar').send({
			title: 'Test 1',
			// type: 'acad', -> Missing type
			startDate: '2020-04-20T12:00:00-03:00',
		});

		expect(response.status).toBe(400);
	});

	it('Should return an error when startDate is not specified on create', async () => {
		const response = await request(app).post('/calendar').send({
			title: 'Test 1',
			type: 'acad',
			// startDate: '2020-04-20T12:00:00-03:00', -> Missing start date
		});

		expect(response.status).toBe(400);
	});

	it('should not allow startDate > endDate', async () => {
		const response = await request(app).post('/calendar').send({
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
			.send();

		expect(response.status).toBe(404);
	});

	it('Should return ok when trying to delete an event that does exist', async () => {
		// Create an event and get its id
		const responseCreate = await request(app).post('/calendar').send({
			title: 'Test 1',
			type: 'acad',
			startDate: '2020-04-20T12:00:00-03:00',
		});

		// Try to delete event
		const responseDelete = await request(app)
			.delete(`/calendar/${responseCreate.body._id}`)
			.send();

		expect(responseDelete.status).toBe(204);
	});
});