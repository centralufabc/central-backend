export default (req, res, next) => {
	if (!req.user.isAdmin) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	return next();
};
