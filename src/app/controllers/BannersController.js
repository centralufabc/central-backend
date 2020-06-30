import { parseISO } from 'date-fns';
import Banner from '../schemas/Banner';

class BannersController {
	async createBanner(req, res) {
		const { start, finish, imgUrl, linkUrl } = req.body;
		const { user } = req;

		const newBanner = await Banner.create({
			start: parseISO(start),
			finish: finish ? parseISO(finish) : undefined,
			userId: user.id,
			imgUrl,
			linkUrl,
		});

		return res.json(newBanner);
	}
}

export default new BannersController();
