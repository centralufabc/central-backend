import request from 'supertest';
import app from '../../src/app';

describe('Celebrate', () => {
	it('should return ok if query, param and body are valid', async () => {
		const response = await request(app)
			.post('/celebrate/1?page=1')
			.send({ email: 'jill@stars.com' });

		expect(response.body.message).toBe('ok');
	});
});
