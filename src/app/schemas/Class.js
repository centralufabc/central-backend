import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
	},
	class: {
		type: String,
		required: true,
	},
	theory: {
		type: String,
	},
	practice: {
		type: String,
	},
	theoryTeacher: {
		type: String,
	},
	practiceTeacher: {
		type: String,
	},
	raList: {
		type: [String],
		required: true,
	},
});

export default mongoose.model('Class', ClassSchema);
