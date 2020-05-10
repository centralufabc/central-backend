import mongoose from 'mongoose';

class Database {
	constructor() {
		this.mongo();
	}

	mongo() {
		let connectionUrl;
		if (process.env.NODE_ENV === 'development') {
			connectionUrl = 'mongodb://localhost:27017/central-dev2';
		} else if (process.env.NODE_ENV === 'test') {
			connectionUrl = 'mongodb://localhost:27017/central-dev-test';
		} else {
			connectionUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_DOMAIN}/${process.env.MONGO_NAME}`;
		}

		this.mongoConnection = mongoose.connect(connectionUrl, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
	}
}

export default new Database();
