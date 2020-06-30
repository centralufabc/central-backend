import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema(
	{
		start: {
			type: Date,
			required: true,
		},
		finish: {
			type: Date,
		},
		// -1: Rejected, 0: Disabled, 1: Approved/Enabled, 2: Pending
		status: {
			type: Number,
			required: true,
			default: 2,
			validate: {
				validator: Number.isInteger,
				message: '{VALUE} is not an integer value',
			},
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		views: {
			type: Number,
			required: true,
			default: 0,
		},
		clicks: {
			type: Number,
			required: true,
			default: 0,
		},
		imgUrl: {
			type: String,
		},
		linkUrl: {
			type: String,
		},
		priority: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Banner', BannerSchema);
