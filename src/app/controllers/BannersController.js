import { parseISO } from 'date-fns';
import Banner from '../schemas/Banner';

class BannersController {
	async getBanners(req, res) {
		const now = Date.now();

		const banners = await Banner.find({
			$and: [
				{
					$or: [
						{ start: { $lte: now }, finish: { $gte: now } },
						{ start: { $lte: now }, finish: undefined },
					],
				},
				{ status: 1 },
			],
		});

		return res.json(banners);
	}

	async createBanner(req, res) {
		const { start, finish, imgUrl, linkUrl } = req.body;
		const { user } = req;

		const newBanner = await Banner.create({
			start: parseISO(start),
			finish: finish ? parseISO(finish) : undefined,
			userId: user.id,
			status: user.isAdmin ? 1 : 2, // 1: Enabled, 2: Pending
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
