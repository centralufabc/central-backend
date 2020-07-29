import { parseISO, isBefore } from 'date-fns';
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

	async getUserBanners(req, res) {
		const { user } = req;

		const banners = await Banner.find({
			userId: user.id,
		});

		return res.json(banners);
	}

	async createBanner(req, res) {
		const { start, finish, imgUrl, linkUrl } = req.body;
		const { user } = req;

		if (isBefore(parseISO(start), Date.now())) {
			return res
				.status(400)
				.json({ error: "'start' cannot be on a past date" });
		}

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

	async incrementViews(req, res) {
		const { id } = req.params;

		const banner = await Banner.findById(id);

		banner.views += 1;
		banner.save();

		return res.status(204).send();
	}

	async incrementClicks(req, res) {
		const { id } = req.params;

		const banner = await Banner.findById(id);

		banner.clicks += 1;
		banner.save();

		return res.status(204).send();
	}
}

export default new BannersController();
