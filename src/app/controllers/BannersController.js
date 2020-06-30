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

	async disableBanner(req, res) {
		const { id } = req.params;
		const userId = req.user.id;

		// Get banner by id
		const banner = await Banner.findById(id);

		// Check if user matches
		if (banner.userId.toString() !== userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// Change status to 0
		banner.status = 0;
		banner.save();

		return res.json(banner);
	}
}

export default new BannersController();
