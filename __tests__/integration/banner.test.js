import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import Banner from '../../src/app/schemas/Banner';
import User from '../../src/app/schemas/User';

describe('Banner', () => {
	let adminToken;
	let notAdminToken;

	beforeEach(async () => {
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
			email: 'notadmin@aluno.ufabc.edu.br',
			password: 'qwerty',
		});

		notAdminToken = notAdminLogin.body.token;
	});

	afterEach(async () => {
		await User.deleteMany();
		await Banner.deleteMany();
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it('should be able to create a banner with status under review', async () => {
		const response = await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send({
				start: '2030-01-01',
				finish: '2030-02-01',
				imgUrl: 'https://images.unsplash.com/photo',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		expect(response.body.status).toBe(2);
	});

	it('should not be able to create a banner if not logged in', async () => {
		const response = await request(app).post('/banners').send({
			start: '2030-01-01',
			finish: '2030-02-01',
			imgUrl: 'https://images.unsplash.com/photo',
			linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
		});

		expect(response.status).toBe(401);
	});

	it('should not be able to create a banner that starts in a past date', async () => {
		const response = await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send({
				start: '2010-01-01',
				finish: '2030-02-01',
				imgUrl: 'https://images.unsplash.com/photo',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		expect(response.status).toBe(400);
	});

	it('should be able to see its own banners', async () => {
		await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send({
				start: '2030-01-01',
				finish: '2030-02-01',
				imgUrl: 'https://images.unsplash.com/photo',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send({
				start: '2030-03-01',
				finish: '2030-04-01',
				imgUrl: 'https://images.unsplash.com/photo2',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		const response = await request(app)
			.get('/banners/my')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send();

		expect(response.body.length).toBe(2);
	});

	it('should be able to disable an active banner', async () => {
		const bannerResponse = await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send({
				start: '2030-03-01',
				finish: '2030-04-01',
				imgUrl: 'https://images.unsplash.com/photo2',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		const response = await request(app)
			.patch(`/banners/${bannerResponse.body._id}`)
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send();

		expect(response.body.status).toBe(0);
	});

	it('should not be able to disable a banner from another user', async () => {
		const bannerResponse = await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				start: '2030-03-01',
				finish: '2030-04-01',
				imgUrl: 'https://images.unsplash.com/photo2',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		const response = await request(app)
			.patch(`/banners/${bannerResponse.body._id}`)
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send();

		expect(response.status).toBe(401);
	});

	it("should be able to increase a banner's views and clicks counter", async () => {
		const bannerResponse = await request(app)
			.post('/banners')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send({
				start: '2030-03-01',
				finish: '2030-04-01',
				imgUrl: 'https://images.unsplash.com/photo2',
				linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
			});

		const { _id } = bannerResponse.body;

		await request(app).post(`/banners/${_id}/views`).send();

		await request(app).post(`/banners/${_id}/views`).send();

		await request(app).post(`/banners/${_id}/clicks`).send();

		const response = await request(app)
			.get('/banners/my')
			.set('Authorization', `Bearer ${notAdminToken}`)
			.send();

		expect(response.body.length).toBe(1);
		expect(response.body[0].clicks).toBe(1);
		expect(response.body[0].views).toBe(2);
	});

	// it('should be able to get a list of all available banners', async () => {
	// 	await request(app)
	// 		.post('/banners')
	// 		.set('Authorization', `Bearer ${notAdminToken}`)
	// 		.send({
	// 			start: '2030-03-01',
	// 			finish: '2030-04-01',
	// 			imgUrl: 'https://images.unsplash.com/photo2',
	// 			linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
	// 		});

	// 	await request(app)
	// 		.post('/banners')
	// 		.set('Authorization', `Bearer ${notAdminToken}`)
	// 		.send({
	// 			start: '2030-03-01',
	// 			finish: '2030-04-01',
	// 			imgUrl: 'https://images.unsplash.com/photo2',
	// 			linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
	// 		});

	// 	await request(app)
	// 		.post('/banners')
	// 		.set('Authorization', `Bearer ${notAdminToken}`)
	// 		.send({
	// 			start: '2030-03-01',
	// 			finish: '2030-04-01',
	// 			imgUrl: 'https://images.unsplash.com/photo2',
	// 			linkUrl: 'https://unsplash.com/photos/dkwJLowVvl4',
	// 		});

	// 	// Approve all banners
	// 	const banners = await Banner.find();

	// 	banners.forEach(async (banner) => {
	// 		banner.status = 1;
	// 		await banner.save();
	// 	});

	// 	// TODO: This piece of code does not work as expected
	// 	// jest.spyOn(Date, 'now').mockImplementationOnce(() => {
	// 	// 	return new Date(2030, 2, 5, 12).getTime();
	// 	// });

	// 	const response = await request(app).get(`/banners`).send();

	// 	expect(response.body.length).toBe(3);
	// });
});
