import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import './database';
import routes from './routes';

class App {
	constructor() {
		this.server = express();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.server.use(cors());
		// Config server to receive requests with JSON body
		this.server.use(express.json());
	}

	routes() {
		this.server.use(routes);
		this.server.use(errors());
	}
}

export default new App().server;
