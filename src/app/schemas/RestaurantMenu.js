import mongoose from 'mongoose';

const RestaurantMenuSchema = new mongoose.Schema({
	day: {
		type: Date,
		required: true,
	},
	lunch: {
		type: String,
	},
	dinner: {
		type: String,
		required: true,
	},
	vegetarianOption: {
		type: String,
		required: true,
	},
	garnish: {
		type: String,
		required: true,
	},
	salads: {
		type: [String],
		required: true,
	},
	desserts: {
		type: [String],
		required: true,
	},
});

export default mongoose.model('RestaurantMenu', RestaurantMenuSchema);
