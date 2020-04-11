import mongoose from 'mongoose';

const CalendarEventSchema = new mongoose.Schema(
	{
		title: {
			type: 'String',
			required: true,
		},
		subtitle: {
			type: String,
		},
		type: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
		},
		showTime: {
			type: Boolean,
			required: true,
			default: false,
		},
		imgUrl: {
			type: String,
		},
		link: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('CalendarEvent', CalendarEventSchema);
