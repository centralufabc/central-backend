import mongoose from 'mongoose';

const RestaurantMenuSchema = new mongoose.Schema({
	day: {
		type: Date,
		required: true,
	},
	lunch: {
		type: String,
		required: true,
	},
	dinner: {
		type: String,
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
